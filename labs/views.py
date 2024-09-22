from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import (
	LaboratorySerializer, 
	TestSerializer, 
	TestResultSerializer, 
	BranchSerializer,
	BranchTestSerializer
)
from .models import Test, Branch, Laboratory, BranchTest, Result
from modelmixins.models import SampleType
from modelmixins.models import Facility
from sample.models import Sample
from sample.serializers import SampleSerializer
from django.db.models import Q
from sample.serializers import SampleSerializer
from django.http import QueryDict
from django.core.cache import cache
from rest_framework.exceptions import ValidationError
from .filters import TestFilter
from django_filters.rest_framework import DjangoFilterBackend
import json
from modelmixins.serializers import FacilitySerializer, SampleTypeSerializer
from .tasks import copy_test_to_branch#, get_sample_counts_for_facility
import logging
logger = logging.getLogger('labs')
query_dict = QueryDict('', mutable=True)
# from celery.result import AsyncResult
from rest_framework.views import APIView
from .constants import LEVEL_ORDER
from modelmixins.paginators import QueryPagination
# from sample.serializers import CountObjectsSerializer



class PermissionMixin(object):
	"""
	Mixin class for laboratory specific permissions.

	Validates whether a user has the right permission to make changes to a specific laboratory and its branches.
	"""
	permission_classes = [IsAuthenticated]


	"""
	Checks whether the authenticated user has the right account type and roles,
	Returns a Bool
	"""
	def has_laboratory_permission(self, user):

		return user.account_type == 'Laboratory' and (user.is_admin or user.is_staff)


	"""
	Checks whether the user is the laboratory CEO or general manager,
	it allows both the laboratory CEO and branch manager to edit the Branch details
	"""
	def has_permission_to_edit_branch(self, user, branch):
		return (
			user.is_authenticated and
			(
				(user == branch[0].laboratory.created_by) or
				(user == branch[0].branch_manager)
			)
		)


class CacheMixin:
    cache_timeout = 300  # 5 minutes

    def dispatch(self, request, *args, **kwargs):
        key = self.get_cache_key(request, *args, **kwargs)
        response = cache.get(key)
        if response is None:
            response = super().dispatch(request, *args, **kwargs)
            cache.set(key, response, self.cache_timeout)
        return response

    def get_cache_key(self, request, *args, **kwargs):
        return f'view_cache_{request.path}_{request.user.id}'


class CreateLaboratoryView(PermissionMixin, generics.CreateAPIView):
	"""
	The API endpoint that allows a user to create a laboratory.
	Inherits the custom permission class defined at the top of this model.
	The sign in user is automatically assign as the CEO or General manager unless otherwise
	"""

	parser_classes = (MultiPartParser, FormParser)
	serializer_class = LaboratorySerializer

	def post(self, request):

		"""
		Checks if the user has the appropriate permission
		this prevents the situation where a user with the account type as a hospital or delivery adding a lab
		"""
		if not self.has_laboratory_permission(self.request.user):

			return Response(
				{'error': 'Invalid user.'}, 
				status=status.HTTP_400_BAD_REQUEST
			)

		return self.create(request)

	def perform_create(self, serializer):
		serializer.save(created_by=self.request.user)


class UpdateLaboratoryDetails(PermissionMixin, generics.UpdateAPIView):
	"""
	The API endpoint that allows the user to update their lab, 
	Inherits the custom PermissionMixin class defined at the top of this model.
	Checks if the user is associated with the lab.
	"""
	serializer_class = LaboratorySerializer

	def get_queryset(self):
		return Laboratory.objects.filter(created_by=self.request.user)

	def patch(self, request, pk):
		"""
		Permission check to ensure the right user is interracting with right model.
		"""
		if not self.has_laboratory_permission(self.request.user):

			return Response(
				{'error': 'Invalid user'}, 
				status=status.HTTP_401_UNAUTHORIZED
			)
		return self.partial_update(request, pk)




class DeleteLaboratory(PermissionMixin, generics.DestroyAPIView):
	"""
	The API endpoint that allows users to delete the lab instance they have created.
	Inherits from the custom PermissionMixin class defined at the begiining of this 
	model.
	"""


	def get_queryset(self):
		"""
		Returns a queryset of the Lab created by the user using the created_by field in the 
		Lab table
		"""
		return Laboratory.objects.filter(created_by=self.request.user)

	def delete(self, request, pk):

		
		"""
		Permission check to ensure the right user is the deleting the appropriate object.
		"""
		if not self.has_laboratory_permission(self.request.user):

			return Response(
				{'error': 'Invalid credentials'}, 
				status=status.HTTP_401_UNAUTHORIZED
			)
		
		return self.destroy(request, pk)


class LaboratoryUserVIew(PermissionMixin, generics.ListAPIView):
	"""
	The API endpoint to get Laboratory associated with user
	"""
	serializer_class = LaboratorySerializer

	def get_queryset(self):
		return Laboratory.objects.filter(created_by=self.request.user).order_by('id')



class CreateBranchView(PermissionMixin, generics.CreateAPIView):

	"""
	Api endpoint for adding a branch to the laboratory the user has created.
	This auto assigns he Branch manager role to the genral manager that is the logged in user.
	The branch manager the option of inviting a branch manager to take over that role as the branch manager.
	"""

	serializer_class = BranchSerializer

	def post(self, request):

		if not self.has_laboratory_permission(self.request.user):

			return Response(
				{'error': 'Invalid user.'}, 
				status=status.HTTP_400_BAD_REQUEST
			)

		return self.create(request)

	def perform_create(self, serializer):

		"""
		A data base query to ge the laboratory the branch is being added to
		"""

		lab = Laboratory.objects.get(created_by=self.request.user)

		serializer.save(branch_manager=self.request.user, laboratory=lab, facility_type='Laboratory')


class BranchListView(PermissionMixin, generics.ListAPIView):

	"""
	API endpoint that allows either the Laboratory CEO or Branch manager to view their Branch.
	This returns a list of objects, if the user multiple branches, a query set is returned.
	"""

	serializer_class = BranchSerializer

	def get_queryset(self):

		"""
		Uses the Q object to return either Branches own by the Laboratory or managed by the logged in user.
		"""
		return Branch.objects.filter(
			Q(laboratory__created_by=self.request.user) |
			Q(branch_manager=self.request.user)
		).order_by('id')


class BranchUpdateView(PermissionMixin, generics.UpdateAPIView):
	"""
	API end point that allows the user to update their facility.
	This allows both the Branch manager or Laboratory CEO to update 
	The Branch
	"""
	serializer_class = BranchSerializer

	def get_queryset(self):

		return Branch.objects.filter(pk=self.kwargs.get('pk'))

	def patch(self, request, pk, format=None):

		branch = self.get_queryset()

		"""
		Checks if the user the permisssion to edit the Branch
		Raises an unauthorized error.
		"""
		if not self.has_permission_to_edit_branch(request.user, branch):

			return Response(
				{'error': 'Invalid credentials'}, 
				status=status.HTTP_401_UNAUTHORIZED
			)

		return self.partial_update(request, pk, format=None)


class BranchDeleteView(PermissionMixin, generics.DestroyAPIView):
	"""
	API endpoint for a user to delete the Branch they have created.
	This allows on the Lab CEO to delete the Branch.
	"""

	def get_queryset(self):
		return Branch.objects.filter(pk=self.kwargs.get('pk'))

	def delete(self, request, pk, format=None):

		"""
		Checks the user roles and deletes the Branch.
		"""
		if not self.has_laboratory_permission(self.request.user):

			return Response(
				{'error': 'Invalid credentials'}, 
				status=status.HTTP_401_UNAUTHORIZED
			)

		return self.destroy(request, pk, format=None)



class CreateTestView(PermissionMixin, generics.CreateAPIView):
	"""
	API endpoint to allow the user to add a test to their Branch,
	It allows the user to add the test to multiple Branches at a go.
	"""
	serializer_class = TestSerializer

	def post(self, request):

		if not self.has_laboratory_permission(self.request.user):

			return Response(
				{'error': 'Invalid credentials'}, 
				status=status.HTTP_400_BAD_REQUEST
			)
		
		return self.create(request)

	def perform_create(self, serializer):

		test = serializer.save()
		#query_dict.update(self.request.data)
		branches = self.request.data.get('branch', [])
		# branches = query_dict.getlist('branch')
		test.branch.add(*branches)


class TestListView(generics.ListAPIView):
	"""
	Api endpoint that allows the client to fetch tests for a particular laboratory
	or its branch

	It takes either the branch id or the Laboratory id
	"""
	serializer_class = TestSerializer
	filter_backends = [DjangoFilterBackend]
	filterset_class = TestFilter
	pagination_class = QueryPagination
	#cache_timeout = 600
	def get_serializer_context(self):

		context = super().get_serializer_context()
		context.update({'pk': self.kwargs.get('pk')})

		return context

	def list(self, request, *args, **kwargs):
		paginate = self.request.query_params.get('paginate', 'true').lower()
        
        # Disable pagination if ?paginate=false is in the query params
		if paginate == 'false':
			queryset = self.get_queryset()
			serializer = self.get_serializer(queryset, many=True)
			return Response(serializer.data)
		else:
            # Apply pagination normally
			return super().list(request, *args, **kwargs)

	def get_queryset(self):

		status = self.request.GET.get('status')
		test_status = self.request.GET.get('test_status')
		search_term = self.request.query_params.get('search')
		test_status = (status or test_status or '')


		tests = Test.objects.filter(
			Q(branch__id=self.kwargs.get('pk')) | Q(branch__laboratory__id=self.kwargs.get('pk'))
			)

		print(search_term)
		if search_term:
			print('Here')
			return tests.filter(name__icontains=search_term)


		if test_status in ('active', 'inactive', 'Active', 'Inactive'):
			print(test_status)
			return tests.filter(test_status__icontains=test_status)

		return tests


class TestUpdateView(PermissionMixin, generics.UpdateAPIView):
	"""
	Api end point for updating test for a laboratory.
	It accepts the test id
	"""
	serializer_class = TestSerializer

	def get_queryset(self):

		return Test.objects.filter(pk=self.kwargs.get('pk'))

	def patch(self, request, pk):

		if not self.has_laboratory_permission(self.request.user):

			return Response(
				{'error': 'Invalid credentials'}, 
				status=status.HTTP_401_UNAUTHORIZED
			)

		return self.partial_update(request, pk)

	def perform_update(self, serializer):

		#Clears the current branch set for the tests
		query_dict.update(self.request.data)
		branches = query_dict.get('branch')
		#Updates the test with the new branches if there is any.
		if not branches and len(query_dict) < 1:
			raise ValidationError(
				{'error': 'Test must have at least one(1) branch'}
			)
		# print(branches)
		test = serializer.save()

		if branches:
			test.branch.clear()
			test.branch.add(*branches)


class TestDeleteView(PermissionMixin, generics.DestroyAPIView):

	"""
	API endpoint foe delete test for a laboratory or Branch.
	This deletes the test for all the branches where it is being
	done.
	Caution must be taken when calling this endpoint.
	"""

	def get_queryset(self):

		return Test.objects.filter(pk=self.kwargs.get('pk'))

	def delete(self, request, pk, format=None):

		if not self.has_laboratory_permission(self.request.user):

			return Response(
				{'error': 'Invalid credentials'}, 
				status=status.HTTP_401_UNAUTHORIZED
			)

		return self.destroy(request, pk, format=None)


class CreateTestResultView(PermissionMixin, generics.CreateAPIView):
	serializer_class = TestResultSerializer

	def post(self, request):

		if not self.has_laboratory_permission(self.request.user):

			return Response(
				{'error': 'Invalid credentials'}, 
				status=status.HTTP_401_UNAUTHORIZED
			)
		print(request.data)
		return self.create(request)


	def perform_create(self, serializer):

		serializer.save(send_by=self.request.user)


class TestResultListView(BranchListView):
	serializer_class = TestResultSerializer
	pagination_class = QueryPagination

	def get_queryset(self):
		return Result.objects.filter(
			Q(branch__branch_manager=self.request.user) | 
			Q(branch__laboratory__created=self.request.user)
		).order_by('-date_added')


class TestResultUpdateView(PermissionMixin, generics.UpdateAPIView):
	serializer_class = TestResultSerializer

	def get_queryset(self):
		return Result.objects.all()

	def patch(self, request, pk):

		if not self.has_laboratory_permission(self.request.user):

			return Response(
				{'error': 'Invalid credentials'}, 
				status=status.HTTP_401_UNAUTHORIZED
			)

		return self.partial_update(request, pk)



class TestResultDeleteView(PermissionMixin, generics.DestroyAPIView):

	def get_queryset(self):
		return Result.objects.all()

	def delete(self, request, pk, format=None):

		if not self.has_laboratory_permission(self.request.user):

			return Response(
				{'error': 'Invalid credentials'}, 
				status=status.HTTP_401_UNAUTHORIZED
			)

		return self.destroy(request, pk, format=None)


class LaboratorySampleSerializerView(PermissionMixin, generics.CreateAPIView):

	queryset = Sample.objects.all()
	serializer_class = SampleSerializer
	parser_classes = (MultiPartParser, FormParser)

	def post(self, request):

		if not self.has_laboratory_permission(self.request.user):

			return Response(
				{'error': 'Invalid credentials'}, 
				status=status.HTTP_401_UNAUTHORIZED
			)
		
		data = request.data.dict() if isinstance(request.data, QueryDict) else request.data.copy()
		# print(data)
		if 'tests' in data:

			tests = json.loads(data['tests'])
			if isinstance(tests, list):
				
				data['tests'] = tests
			
		request._full_data = data
		
		return self.create(request)

	def perform_create(self, serializer):

		user = self.request.user
		
		tests = self.request.data['tests']

		sample = serializer.save(
				sender_full_name=user.full_name,
				sender_phone=user.phone_number,
				sender_email=user.email,
				facility_type='Laboratory'
			)
		# print(sample)
		sample.tests.add(*tests)


class LaboratorySampleUpdateView(PermissionMixin, generics.UpdateAPIView):
	'''Update details of a specific sample.'''
	serializer_class = SampleSerializer
	queryset = Sample.objects.all()

	def patch(self, request, pk):

		return self.partial_update(request, pk)

	def perform_update(self, serializer):
		sample = serializer.save()
		# sample.tests.clear()
		query_dict.update(self.request.data)
		#tests = self.request.data.getlist('tests')
		if self.request.data['request_status']:
			pass

		tests = query_dict.getlist('tests')
		sample.tests.add(*tests)



class LaboratorySampleDeleteView(PermissionMixin, generics.DestroyAPIView):
	'''Deletes a specific sample.'''

	def delete(self, request, pk, format=None):

		return super().delete(request, pk, format=None)



class AllLaboratories(generics.ListAPIView):

	serializer_class = FacilitySerializer
	
	def get_queryset(self):
        # Get the level from the request query parameters
		facility_level = self.request.GET.get('facility_level')
        
        # Check if the level is valid
		if facility_level in LEVEL_ORDER:
            # Get the numeric value for the level
			level_value = LEVEL_ORDER[facility_level]

            # Generate the levels to include (levels >= the current one)
			valid_levels = [level for level, value in LEVEL_ORDER.items() if value >= level_value]

            # Build the query
			return Facility.objects.filter(
                Q(hospitallab__isnull=False) | Q(branch__isnull=False)
            ).filter(
                Q(hospitallab__level__in=valid_levels) | 
                Q(branch__level__in=valid_levels)
            ).select_related('branch', 'hospitallab')#.order_by('?')

        # Return an all labs queryset if no valid level is provided
		return Facility.objects.filter(
			Q(hospitallab__isnull=False) | Q(branch__isnull=False)
			).select_related('branch', 'hospitallab')
	


class LaboratorySampleList(PermissionMixin, generics.ListAPIView):
	serializer_class = SampleSerializer
	# pagination_class = QueryPagination

	def get_queryset(self):
		status = self.request.GET.get('status')
		from_date = self.request.GET.get('from_date')
		to_date = self.request.GET.get('to_date')
		pk = self.kwargs.get('pk')

		try:

			if status:

				return Sample.objects.filter(
					Q(to_laboratory=pk) | Q(to_laboratory__branch__laboratory=pk), sample_status=status.capitalize(), request_status='Request Accepted').order_by('-date_created')

			if from_date and to_date:

				return Sample.objects.filter(
					Q(to_laboratory=pk) | Q(to_laboratory__branch__laboratory=pk), date__range=(from_date, to_date), request_status='Request Accepted').order_by('-date_created')

			return Sample.objects.filter(
					Q(to_laboratory=pk) | Q(to_laboratory__branch__laboratory=pk), request_status='Request Accepted').order_by('-date_created')

		except Sample.DoesNotExist:
			return Response(
				{'error': 'No sample sent.'},
				status=status.HTTP_404_NOT_FOUND
			)


class LaboratorySampleRequests(PermissionMixin, generics.ListAPIView):

	serializer_class = SampleSerializer
	# pagination_class = QueryPagination

	def get_queryset(self):

		status = self.request.GET.get('status')
		from_date = self.request.GET.get('from_date')
		to_date = self.request.GET.get('to_date')

		if status:

			return Sample.objects.filter(referring_facility=self.kwargs.get('pk')).filter(sample_status__icontains=status).order_by('-date_created')

		if from_date and to_date:

			return Sample.objects.filter(referring_facility=self.kwargs.get('pk')).filter(date__range=(from_date, to_date)).order_by('-date_created')

		return Sample.objects.filter(
			referring_facility=self.kwargs.get('pk')
		).order_by('-date_created')


class SampleTypeView(PermissionMixin, generics.CreateAPIView):
	serializer_class = SampleTypeSerializer

	def post(self, request):

		if not self.has_laboratory_permission(self.request.user):

			return Response(

				{'error': 'Invalid credentials'}, 
				status=status.HTTP_401_UNAUTHORIZED
			)

		return self.create(request)


class SampleTypeUpdateView(PermissionMixin, generics.UpdateAPIView):

	serializer_class = SampleTypeSerializer

	def get_queryset(self):
		return SampleType.objects.filter(pk=self.kwargs.get('pk'))

	def patch(self, request, pk):

		if not self.has_laboratory_permission(self.request.user):

			return Response(
				{'error': 'Invalid credentials'}, 
				status=status.HTTP_401_UNAUTHORIZED
			)

		return self.partial_update(request, pk)


class SampleTypeDeleteView(PermissionMixin, generics.DestroyAPIView):
	'''
	Deletes a specific sample type.
	params: sample type id: int
	'''
	def get_queryset(self):
		return SampleType.objects.filter(pk=self.kwargs.get('pk'))

	def delete(self, request, pk, format=None):

		return super().delete(request, pk, format=None)


class GetTestSampleType(generics.ListAPIView):
	"""
	Api endpoint that fetches the sample type relating to a particular test.
	params: test id=UUID
	"""
	serializer_class = SampleTypeSerializer
	# pagination_class = QueryPagination

	def get_queryset(self):
		obj_id = self.kwargs.get('pk')
		return SampleType.objects.filter(
				Q(test=obj_id)|
				Q(test__branch__laboratory=obj_id)
			).order_by('id')


class UpdateTestForSpecificBranch(PermissionMixin, generics.UpdateAPIView):

	serializer_class = BranchTestSerializer

	def get_object(self):
		queryset = BranchTest.objects.all()
		test_id = self.kwargs.get('test_id')
		branch_id = self.kwargs.get('branch_id')
		obj = generics.get_object_or_404(queryset, test_id=test_id, branch_id=branch_id)

		return obj

	def patch(self, request, *args, **kwargs):

		partial = kwargs.pop('partial', False)
		instance = self.get_object()
		serializer = self.get_serializer(instance, data=request.data, partial=partial)
		serializer.is_valid(raise_exception=True)

		self.perform_update(serializer)

		return Response(serializer.data, status=status.HTTP_200_OK)


class CopyTests(generics.CreateAPIView):

	serializer_class = TestSerializer

	def post(self, request, *args, **kwargs):

		test_ids = self.request.data.getlist('test_ids', [])
		print(test_ids)
		target_branch_id = self.kwargs.get('branch_to_copy_to_id')

		result = copy_test_to_branch.delay(test_ids, target_branch_id)

		print(result) 

		return Response({'task_id': result.id}, status=status.HTTP_202_ACCEPTED)


class CountFacilityObjects(APIView):

	def get(self, request, *args, **kwargs):

		facility_id = self.kwargs.get('facility_id')

		counts = {

			'pending': Sample.objects.filter(referring_facility=facility_id, sample_status='Pending').count(),
			'process': Sample.objects.filter(referring_facility=facility_id, sample_status='Processed').count(),
			'rejected': Sample.objects.filter(referring_facility=facility_id, sample_status='Rejected').count(),
			'received': Sample.objects.filter(referring_facility=facility_id, sample_status='Received').count()

			}

		return Response(counts, status=status.HTTP_200_OK)