from rest_framework.permissions import IsAuthenticated # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import generics # type: ignore
from rest_framework import status # type: ignore
from rest_framework.parsers import MultiPartParser, FormParser # type: ignore
from .serializers import (
	LaboratorySerializer,
	TestSerializer,
	BranchSerializer,
	BranchTestSerializer
)
from .models import Test, Branch, Laboratory, BranchTest
from modelmixins.models import SampleType
from modelmixins.models import Facility
from django.db.models import Q # type: ignore
from django.http import QueryDict # type: ignore
from django.core.cache import cache # type: ignore
from rest_framework.exceptions import ValidationError # type: ignore
from modelmixins.serializers import FacilitySerializer, SampleTypeSerializer
from .utils import get_nearby_branches, filter_by_facility_level

# from .tasks import copy_test_to_branch
import logging
from modelmixins.utils import ensure_uuid
logger = logging.getLogger('labs')
query_dict = QueryDict('', mutable=True)
# from .constants import LEVEL_ORDER
from modelmixins.paginators import QueryPagination


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
		return Laboratory.objects.filter(created_by=self.request.user)


class CreateBranchView(PermissionMixin, generics.CreateAPIView):

	"""
	Api endpoint for adding a branch to the laboratory the user has created.
	This auto assigns the Branch manager role to the general manager that is the logged in user.
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
		A data base query to get the laboratory the branch is being added to
		"""
		lab = self.request.user.laboratory
		# print(lab)
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
		).order_by('-date_added')


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

        branches = self.request.data.get('branch', [])
        test.branch.add(*branches)


class TestListView(generics.ListAPIView):
    """
    API endpoint to fetch tests for a specific laboratory or its branch.
    Accepts either a branch ID or a laboratory ID as input.
    """

    serializer_class = TestSerializer
    pagination_class = QueryPagination

    def get_serializer_context(self):
        """
        Adds the primary key (pk) to the serializer context.
        """
        context = super().get_serializer_context()
        context.update({"pk": self.kwargs.get("pk")})
        return context

    def list(self, request, *args, **kwargs):
        """
        Overrides the default list method to support optional pagination.
        If ?paginate=false is passed in the query parameters, pagination is disabled.
        """
        paginate = self.request.query_params.get("paginate", "true").lower()
        queryset = self.get_queryset()

        if paginate == "false":
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        """
        Returns a queryset of tests filtered by:
        - Branch ID or Laboratory ID (based on the URL parameter `pk`)
        - Test status (active/inactive)
        - Sample type
        - Search term
        """
        pk = self.kwargs.get("pk")
        search_term = self.request.query_params.get("search")
        test_status = self.request.query_params.get(
            "status"
        ) or self.request.query_params.get("test_status", "")
        sample_type = self.request.query_params.get("sample_type")

        # Base queryset filtered by branch or laboratory ID
        tests = Test.objects.filter(
            Q(branch__id=pk) | Q(branch__laboratory__id=pk)
        ).prefetch_related(
            "branch",
            "branch_test__branch",
        )

        # Add filtering conditions
        filter_conditions = Q()
        if search_term:
            filter_conditions &= Q(name__icontains=search_term)
        if test_status.lower() in ("active", "inactive"):
            filter_conditions &= Q(test_status__icontains=test_status)
        if sample_type:
            filter_conditions &= Q(sample_type=sample_type)

        # Apply additional filters, if any
        if filter_conditions:
            tests = tests.filter(filter_conditions)

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

		query_dict.update(self.request.data)
		branches = query_dict.get('branch')
		#Updates the test with the new branches if there is any.
		if not branches and len(query_dict) < 1:
			raise ValidationError(
				{'error': 'Test must have at least one(1) branch'}
			)

		test = serializer.save()

		if branches:
			#Clears the current branch & set the new branches for the tests
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


class AllLaboratories(generics.ListAPIView):
    serializer_class = FacilitySerializer
    DEFAULT_MAX_DISTANCE = 15000

    def get_queryset(self):
        max_dist = float(
            self.request.GET.get("max_distance", self.DEFAULT_MAX_DISTANCE)
        )

        facility_level = self.request.GET.get("level")
        gps_coordinates = self.request.GET.get("gps_coordinates")
        user_lat, user_long = map(float, gps_coordinates.split(","))
		
        # print(user_lat, user_long)

        query = Facility.objects.filter(
            Q(hospitallab__isnull=False) | Q(branch__isnull=False)
        ).select_related("branch", "hospitallab")

        if facility_level and not (user_lat and user_long):
            return filter_by_facility_level(query, facility_level)

        # If only location is provided
        if (user_lat and user_long) and not facility_level:
            return get_nearby_branches(
                query=query,
                user_lat=user_lat,
                user_long=user_long,
                max_distance_km=max_dist,
            )

        # If both facility_level and location are provided
        if facility_level and (user_lat and user_long):
            query = filter_by_facility_level(query, facility_level)
            return get_nearby_branches(
                query=query,
                user_lat=user_lat,
                user_long=user_long,
                max_distance_km=max_dist,
            )

        # print(query)
        # Return an all labs queryset if no valid param is provided
        return query


class SampleTypeView(PermissionMixin, generics.CreateAPIView):
	serializer_class = SampleTypeSerializer

	def post(self, request):
		#Checks if the use has the required permission
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
				Q(test__branch__laboratory=obj_id)|
				Q(test__branch=obj_id)
			).distinct()


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

    def post(self, request, *args, **kwargs):

        test_ids = self.request.data.getlist('test_ids', [])
        target_branch_id = self.kwargs.get('branch_to_copy_to_id')

        if not test_ids or not target_branch_id:

            return Response({'error': 'Test IDs and target branch ID are required'},
                            status=status.HTTP_400_BAD_REQUEST)

        test_ids = [ensure_uuid(test_id) for test_id in test_ids]
        target_branch_id = ensure_uuid(target_branch_id)

        # Remove any None values (invalid UUIDs)
        test_ids = [test_id for test_id in test_ids if test_id is not None]

        if not test_ids or target_branch_id is None:
            return Response({'error': 'Invalid UUID format'}, status=status.HTTP_400_BAD_REQUEST)

        # Call the Dramatiq task
        # task = copy_test_to_branch.send(test_ids, target_branch_id)

        return Response({
            'message': f'Copying test to {target_branch_id}',
            'task_id': 'task.message_id'
        }, status=status.HTTP_202_ACCEPTED)
