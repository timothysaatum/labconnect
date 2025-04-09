from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import (
	LaboratorySerializer,
	TestSerializer,
	BranchSerializer,
	BranchTestSerializer
)
from .models import Test, Branch, Laboratory, BranchTest
from modelmixins.models import SampleType
from modelmixins.models import Facility
from django.db.models import Q
from django.http import QueryDict
from django.core.cache import cache
# from rest_framework.exceptions import ValidationError
from modelmixins.serializers import FacilitySerializer, SampleTypeSerializer
from .utils import get_nearby_branches, filter_by_facility_level
from rest_framework.permissions import BasePermission
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
		return user.account_type == 'Laboratory' and user.is_admin
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
	
	def has_permission_to_edit_lab(self):
	    return self.request.user


class IsLaboratoryOwnerOrManager(BasePermission):
    """
    Custom permission for managing laboratories, branches, and tests.
    """
    
    def has_permission(self, request, view):
        """
        Grants general permission only to authenticated users with account_type 'Laboratory'.
        """
        return request.user.is_authenticated and request.user.account_type == 'Laboratory'

    def has_object_permission(self, request, view, obj):
        """
        Ensures the user is authorized to:
        - Edit a laboratory if they created it.
        - Edit a branch if they are the lab owner or branch manager.
        - Edit a test only if they manage ALL its assigned branches or lab owner.
        """
        user = request.user

        # Check if object is a laboratory
        if hasattr(obj, 'created_by') and obj.__class__.__name__ == "Laboratory":
            
            return obj.created_by == user

        # Check if object is a branch
        if hasattr(obj, 'laboratory') and obj.__class__.__name__ == "Branch":
            
            return obj.laboratory.created_by == user or obj.branch_manager == user

        # Check if object is a test (M2M: must have permission to ALL its branches)
        if hasattr(obj, 'branch') and obj.__class__.__name__ == "Test":
            print("Ancient one")
            return all(
                branch.laboratory.created_by == user or branch.branch_manager == user
                for branch in obj.branch.all()
            )

        return False




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


class CreateLaboratoryView(generics.CreateAPIView):
	"""
	The API endpoint that allows a user to create a laboratory.
	Inherits the custom permission class defined at the top of this model.
	The sign in user is automatically assign as the CEO or General manager unless otherwise
	"""
	permission_classes = [IsLaboratoryOwnerOrManager]
	parser_classes = (MultiPartParser, FormParser)
	serializer_class = LaboratorySerializer

	def perform_create(self, serializer):
		serializer.save(created_by=self.request.user)


class UpdateLaboratoryDetails(generics.UpdateAPIView):

	"""
	The API endpoint that allows the user to update their lab,
	Inherits the custom PermissionMixin class defined at the top of this model.
	Checks if the user is associated with the lab.
	"""
	permission_classes = [IsLaboratoryOwnerOrManager]

	serializer_class = LaboratorySerializer
	def get_queryset(self):
		return Laboratory.objects.filter(created_by=self.request.user)

	def patch(self, request, pk):

		"""
		Permission check to ensure the right user is interracting with right model.
		"""
		return self.partial_update(request, pk)


class DeleteLaboratory(generics.DestroyAPIView):
	"""
	The API endpoint that allows users to delete the lab instance they have created.
	Inherits from the custom PermissionMixin class defined at the begiining of this
	model.
	"""
	permission_classes = [IsLaboratoryOwnerOrManager]
	def get_queryset(self):
		"""
		Returns a queryset of the Lab created by the user using the created_by field in the
		Lab table
		"""
		return Laboratory.objects.filter(created_by=self.request.user)

	def delete(self, request, pk):
	
		return self.destroy(request, pk)


class LaboratoryUserVIew(generics.ListAPIView):
	"""
	The API endpoint to get Laboratory associated with user
	"""
	permission_classes = [IsLaboratoryOwnerOrManager]
	serializer_class = LaboratorySerializer
	def get_queryset(self):
		return Laboratory.objects.filter(created_by=self.request.user)


class CreateBranchView(generics.CreateAPIView):

	"""
	Api endpoint for adding a branch to the laboratory the user has created.
	This auto assigns the Branch manager role to the general manager that is the logged in user.
	The branch manager the option of inviting a branch manager to take over that role as the branch manager.
	"""
	permission_classes = [IsLaboratoryOwnerOrManager]
	serializer_class = BranchSerializer

	def perform_create(self, serializer):
		"""
		A data base query to get the laboratory the branch is being added to
		"""
		lab = self.request.user.laboratory
		
		serializer.save(branch_manager=self.request.user, laboratory=lab, facility_type='Laboratory')


class BranchListView(generics.ListAPIView):

	"""
	API endpoint that allows either the Laboratory CEO or Branch manager to view their Branch.
	This returns a list of objects, if the user multiple branches, a query set is returned.
	"""
	permission_classes = [IsLaboratoryOwnerOrManager]
	serializer_class = BranchSerializer
	def get_queryset(self):
		"""
		Uses the Q object to return either Branches own by the Laboratory or managed by the logged in user.
		"""
		return Branch.objects.filter(
			Q(laboratory__created_by=self.request.user) |
			Q(branch_manager=self.request.user)
		).order_by('-date_added')


class BranchUpdateView(generics.UpdateAPIView):
	"""
	API end point that allows the user to update their facility.
	This allows both the Branch manager or Laboratory CEO to update
	The Branch
	"""
	permission_classes = [IsLaboratoryOwnerOrManager]
	serializer_class = BranchSerializer
	def get_queryset(self):
		return Branch.objects.filter(pk=self.kwargs.get('pk'))

	def patch(self, request, pk, format=None):
		branch = self.get_queryset()
	
		return self.partial_update(request, pk, format=None)


class BranchDeleteView(generics.DestroyAPIView):
	"""
	API endpoint for a user to delete the Branch they have created.
	This allows on the Lab CEO to delete the Branch.
	"""
	permission_classes = [IsLaboratoryOwnerOrManager]
	def get_queryset(self):
		return Branch.objects.filter(pk=self.kwargs.get('pk'))

	def delete(self, request, pk, format=None):
	
		return self.destroy(request, pk, format=None)


class CreateTestView(generics.CreateAPIView):
    permission_classes = [IsLaboratoryOwnerOrManager]
    serializer_class = TestSerializer

    def post(self, request, *args, **kwargs):

        # Check if the payload is a single object or a list
        is_batch = isinstance(request.data, list)

        # Handle single test creation
        if not is_batch:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Handle batch test creation
        else:
            serializer = self.get_serializer(data=request.data, many=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)


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



class TestUpdateView(generics.UpdateAPIView):
    """
    Api end point for updating test for a laboratory.
    It accepts the test id
    """
    permission_classes = [IsLaboratoryOwnerOrManager]
    serializer_class = TestSerializer

    def get_queryset(self):
        return Test.objects.filter(pk=self.kwargs.get('pk'))

    def patch(self, request, pk):
    
        return self.partial_update(request, pk)

    def perform_update(self, serializer):
        serializer.save()


class TestDeleteView(generics.DestroyAPIView):
	"""
	API endpoint foe delete test for a laboratory or Branch.
	This deletes the test for all the branches where it is being
	done.
	Caution must be taken when calling this endpoint.
	"""
	permission_classes = [IsLaboratoryOwnerOrManager]
	def get_queryset(self):
		return Test.objects.filter(pk=self.kwargs.get('pk'))

	def delete(self, request, pk, format=None):

		return self.destroy(request, pk, format=None)



class AllLaboratories(generics.ListAPIView):
    serializer_class = FacilitySerializer
    DEFAULT_MAX_DISTANCE = 25000

    def get_queryset(self):
        request = self.request
        max_dist = float(request.GET.get("max_distance", self.DEFAULT_MAX_DISTANCE))
        facility_level = request.GET.get("level")
        gps_coordinates = request.GET.get("gps_coordinates")

        # Handle missing or invalid GPS coordinates safely
        user_lat, user_long = None, None
        if gps_coordinates:
            try:
                user_lat, user_long = map(float, gps_coordinates.split(","))
            except ValueError:
                pass  # Keep user_lat, user_long as None

        # Base query: Fetch facilities that are either Hospital Labs or Branches
        query = Facility.objects.filter(
            Q(hospitallab__isnull=False) | Q(branch__isnull=False)
        ).select_related("branch", "hospitallab")

        # If `facility_level` is provided, filter facilities accordingly
        if facility_level:
            query = filter_by_facility_level(query, facility_level)

        # If valid GPS coordinates are provided, apply location-based filtering
        if user_lat is not None and user_long is not None:
            query = get_nearby_branches(query, user_lat, user_long, max_dist)

        return query



class SampleTypeView(generics.CreateAPIView):
	permission_classes = [IsLaboratoryOwnerOrManager]
	serializer_class = SampleTypeSerializer

	def post(self, request):
	
		return self.create(request)


class SampleTypeUpdateView(generics.UpdateAPIView):
	permission_classes = [IsLaboratoryOwnerOrManager]
	serializer_class = SampleTypeSerializer

	def get_queryset(self):

		return SampleType.objects.filter(pk=self.kwargs.get('pk'))

	def patch(self, request, pk):

		return self.partial_update(request, pk)


class SampleTypeDeleteView(generics.DestroyAPIView):
	'''
	Deletes a specific sample type.
	params: sample type id: int
	'''
	permission_classes = [IsLaboratoryOwnerOrManager]
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


class UpdateTestForSpecificBranch(generics.UpdateAPIView):
	permission_classes = [IsLaboratoryOwnerOrManager]
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
