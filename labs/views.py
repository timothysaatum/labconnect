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
	SampleTypeSerializer,
	BranchTestSerializer
)
from .models import Test, Branch, Laboratory, SampleType, BranchTest, Result
# from .results import TestResult
from sample.models import Sample, Notification
from sample.serializers import SampleSerializer
from django.db.models import Q
from sample.serializers import SampleSerializer
from django.http import QueryDict
from django.core.cache import cache
from rest_framework.exceptions import ValidationError
from .filters import TestFilter
from django_filters.rest_framework import DjangoFilterBackend
import json
# from hospital.models import Facility
from .tasks import copy_test_to_branch
import logging
logger = logging.getLogger('labs')
query_dict = QueryDict('', mutable=True)


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
		serializer.save(branch_manager=self.request.user, laboratory=lab)
		



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



class BranchDetailView(generics.RetrieveAPIView):
	"""
	API endpoint that allows the user a detailed view
	of their facility. 
	This view is equally accessible to other users in the system and not just the facility owner.
	"""
	serializer_class = BranchSerializer

	def get_queryset(self, pk):

		return Branch.objects.get(pk=pk)

	def get(self, request, pk, format=None):

		try:
			branch = self.get_queryset(pk=pk)
			serialized_data = BranchSerializer(branch)
			return Response(serialized_data.data)

		except Branch.DoesNotExist:
			return Response(
				{'error': 'Not found'}, 
				status=status.HTTP_404_NOT_FOUND
			)



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
		print(request.data)
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
	#cache_timeout = 600
	def get_serializer_context(self):
		context = super().get_serializer_context()
		context.update({'pk': self.kwargs.get('pk')})
		return context

	def get_queryset(self):
		
		return Test.objects.filter(
			Q(branch__id=self.kwargs.get('pk')) | 
			Q(branch__laboratory__id=self.kwargs.get('pk'))
		).order_by('-date_added')


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
		print(branches)
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

		return self.create(request)


	def perform_create(self, serializer):

		serializer.save(send_by=self.request.user)



class TestResultListView(BranchListView):
	serializer_class = TestResultSerializer

	def get_queryset(self):
		return Result.objects.filter(
			Q(branch__branch_manager=self.request.user) | 
			Q(branch__laboratory__created=self.request.user)
		).order_by('-date_added')



class TestResultDetailView(generics.RetrieveAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = TestResultSerializer

	def get_queryset(self, pk):

		try:
			return Result.objects.get(pk=pk)

		except Result.DoesNotExist:

			return Response(
				{'error': 'result not found'}, 
				status=status.HTTP_404_NOT_FOUND
			)

	def get(self, request, pk, format=None):
		
		test_result = self.get_queryset(pk)
		serialized_data = TestResultSerializer(test_result)

		return Response(serialized_data.data)



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

	# queryset = Sample.objects.all()
	serializer_class = SampleSerializer
	parser_classes = (MultiPartParser, FormParser)

	def post(self, request):

		if not self.has_laboratory_permission(self.request.user):

			return Response(
				{'error': 'Invalid credentials'}, 
				status=status.HTTP_401_UNAUTHORIZED
			)
		tests = json.loads(request.data['tests'])
		# print(tests)
		request.data['tests'] = tests
		return self.create(request)

	def perform_create(self, serializer):
		user = self.request.user
		query_dict.update(self.request.data)
		tests = query_dict.getlist('tests', [])
		# test = json.loads(tests)
		# print(test)
		sample = serializer.save(
				sender_full_name=user.full_name,
				sender_phone=user.phone_number,
				sender_email=user.email,
				facility_type='Laboratory'
			)

		sample.tests.add(*tests)


class LaboratorySampleUpdateView(PermissionMixin, generics.UpdateAPIView):
	'''Update details of a specific sample.'''
	serializer_class = SampleSerializer

	def patch(self, request, pk):

		return self.partial_update(request, pk)

	def perform_update(self, serializer):
		sample = serializer.save()
		sample.tests.clear()
		query_dict.update(self.request.data)
		#tests = self.request.data.getlist('tests')
		tests = query_dict.getlist('tests')
		sample.tests.add(*tests)



class LaboratorySampleDeleteView(PermissionMixin, generics.DestroyAPIView):
	'''Deletes a specific sample.'''

	def delete(self, request, pk, format=None):

		return super().delete(request, pk, format=None)



class AllLaboratories(generics.ListAPIView):

	serializer_class = BranchSerializer
	queryset = Branch.objects.all().order_by('id')



class LaboratorySampleList(PermissionMixin, generics.ListAPIView):
	serializer_class = SampleSerializer

	def get_queryset(self):

		pk = self.kwargs.get('pk')
		try:
			return Sample.objects.filter(
				Q(to_laboratory=pk) |
				Q(to_laboratory__laboratory=pk)
			).order_by('-date_created')

		except Sample.DoesNotExist:
			return Response(
				{'error': 'No sample sent.'}, 
				status=status.HTTP_404_NOT_FOUND
			)


class LaboratorySampleRequests(PermissionMixin, generics.ListAPIView):

	serializer_class = SampleSerializer

	def get_queryset(self):

		return Sample.objects.filter(
			referring_facility=self.kwargs.get('pk')
		).filter(sample_status='Received by laboratory').order_by('-date_created')


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
		target_branch_id = self.kwargs.get('branch_to_copy_id')
		
		task = copy_test_to_branch.delay(test_ids, target_branch_id)

		return Response({'task_id': task.id}, status=status.HTTP_202_ACCEPTED)