from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import (
	ListAPIView, 
	DestroyAPIView, 
	RetrieveAPIView,
	CreateAPIView,
	UpdateAPIView
)
from rest_framework.status import (
		HTTP_200_OK,
		HTTP_201_CREATED,
		HTTP_400_BAD_REQUEST,
		HTTP_401_UNAUTHORIZED,
		HTTP_404_NOT_FOUND
	)
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import (
	LaboratorySerializer, 
	TestSerializer, 
	TestResultSerializer, 
	BranchSerializer,
	LaboratorySampleSerializer
)
from .models import Test, Branch, Laboratory, LaboratorySample
from .results import TestResult
from hospital.models import Sample
from hospital.serializers import SampleSerializer
from django.db.models import Q
from rest_framework.viewsets import ModelViewSet
from django.shortcuts import get_object_or_404  # Avoid repetitive try-except blocks
from rest_framework.decorators import action
from rest_framework.permissions import BasePermission




class PermissionMixin(object):
	permission_classes = [IsAuthenticated]

	def has_laboratory_permission(self):

		return self.request.user.account_type == 'Laboratory' and (
				self.request.user.is_staff or self.request.user.is_admin
			)

	def has_laboratory_permission_to_edit_branch(self, user, branch):
		return (
			user.is_authenticated and
			(
				(user == branch[0].laboratory.created_by) or
				(user == branch[0].branch_manager)
			)
		)

class IsLabManagerOrBranchManager(BasePermission):
	'''
		Custom permission class that allows acess to authorized users only.
		-LabManager have full access
		-BranchManager can access resources only for their own branches

	'''

	def has_permission(self, request, view):
		'''
			Checks if a user has permisison to access the resource.

			Args:
				request(Request): The incoming request object.
				view(APIView): The view being processed.
			Returns:
			bol: True if the user has permission, False otherwise.
		'''

		if request.user.is_admin or request.user.is_staff:
			print('im here.')
			return True

		#check if the viewset has a 'get_queryset' method
		if hasattr(view, 'get_queryset'):
			queryset = view.get_queryset()

			#filter based on user's branch if aplicable(e.g, BranchviewSet)
			if hasattr(request.user,  'branch'):
				queryset = queryset.filter(branch_manager=request.user)
				print(queryset)
			#checks if the requested object exists in the filtered query
			return queryset.exists()
		#default permission for other views(if 'get_queryset' is not available)
		return False



class LaboratoryViewSet(ModelViewSet):
    ''''
	API endpoint for managing laboratories (Create, Read, Update, Delete, List).
	'''
    serializer_class = LaboratorySerializer
    permission_classes = [IsAuthenticated & IsLabManagerOrBranchManager]  # Combine permissions

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_admin:
            return Laboratory.objects.all()
        return Laboratory.objects.filter(created_by=user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated & PermissionMixin])
    def create_branch(self, request, pk=None):
        # Create branch associated with the laboratory
        laboratory = get_object_or_404(Laboratory, pk=pk)
        serializer = BranchSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(laboratory=laboratory)
        return Response(serializer.data, status=HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
        #laboratory_cache.clear()  # Clear cache after laboratory creation














class CreateLaboratoryView(PermissionMixin, CreateAPIView):
	parser_classes = (MultiPartParser, FormParser)
	serializer_class = LaboratorySerializer

	def post(self, request):

		if not self.has_laboratory_permission():

			return Response({'error': 'Your account does not support labs'}, status=HTTP_400_BAD_REQUEST)

		return self.create(request)

	def perform_create(self, serializer):
		serializer.save(created_by=self.request.user)


class LaboratoryUserListVIew(PermissionMixin, ListAPIView):
	serializer_class = LaboratorySerializer

	def get_queryset(self):
		return Laboratory.objects.filter(created_by=self.request.user)


class CreateBranchView(PermissionMixin, CreateAPIView):
	serializer_class = BranchSerializer

	def post(self, request):

		if not self.has_laboratory_permission():

			return Response({'error': 'Your account does not support labs'}, status=HTTP_400_BAD_REQUEST)

		return self.create(request)


class BranchListView(PermissionMixin, ListAPIView):
	serializer_class = BranchSerializer

	def get_queryset(self):

		return Branch.objects.filter(
			Q(laboratory__created_by=self.request.user) |
			Q(branch_manager=self.request.user)
		)


class BranchDetailView(RetrieveAPIView):
	serializer_class = BranchSerializer

	def get_queryset(self, pk):

		return Branch.objects.get(pk=pk)

	def get(self, request, pk, format=None):

		try:
			branch = self.get_queryset(pk=pk)
			serialized_data = BranchSerializer(branch)
			return Response(serialized_data.data)

		except Branch.DoesNotExist:
			return Response({'error': 'Not found'}, status=HTTP_404_NOT_FOUND)


class BranchUpdateView(PermissionMixin, UpdateAPIView):
	serializer_class = BranchSerializer

	def get_queryset(self):
		return Branch.objects.filter(pk=self.kwargs.get('pk'))

	def put(self, request, pk, format=None):

		branch = self.get_queryset()

		if not self.has_laboratory_permission_to_edit_branch(request.user, branch):

			return Response({'error': 'You are not authorized to perform this action'}, status=HTTP_401_UNAUTHORIZED)

		return self.update(request, pk, format=None)


class BranchDeleteView(PermissionMixin, DestroyAPIView):

	def get_queryset(self):
		return Branch.objects.filter(pk=self.kwargs.get('pk'))

	def delete(self, request, pk, format=None):

		if not self.has_laboratory_permission():

			return Response({'error': 'You are not authorized to perform this action'}, status=HTTP_401_UNAUTHORIZED)

		return self.destroy(request, pk, format=None)


class CreateTestView(PermissionMixin, CreateAPIView):
	serializer_class = TestSerializer

	def post(self, request):

		if not self.has_laboratory_permission():

			return Response({'error': 'Unauthorized action'}, status=HTTP_400_BAD_REQUEST)
		
		return self.create(request)

	def perform_create(self, serializer):

		test = serializer.save()
		branches = self.request.data.getlist('branch')

		test.branch.add(*branches)


class TestListView(ListAPIView):
	serializer_class = TestSerializer

	def get_queryset(self):
		return Test.objects.filter(
			Q(branch__id=self.kwargs.get('pk')) | 
			Q(branch__laboratory__id=self.kwargs.get('pk'))
		)


class TestUpdateView(PermissionMixin, UpdateAPIView):
	serializer_class = TestSerializer

	def get_queryset(self):

		return Test.objects.filter(
			Q(branch__branch_manager=self.request.user) | 
			Q(branch__laboratory__created_by=self.request.user)
		)

	def put(self, request, pk, format=None):

		if not self.has_laboratory_permission():

			return Response({'error': 'You are not authorized to perform this action'}, status=HTTP_401_UNAUTHORIZED)

		return super().put(request, pk, format=None)

	def perform_update(self, serializer):

		test = serializer.save()

		test.branch.clear()

		branch = self.request.data.getlist('branch')

		test.branch.add(*branch)


class TestDeleteView(PermissionMixin, DestroyAPIView):

	def get_queryset(self):
		return Test.objects.filter(
			Q(branch__branch_manager=self.request.user) |
			Q(branch__laboratory__created_by=self.request.user)
		)

	def delete(self, request, pk, format=None):

		if not self.has_laboratory_permission():

			return Response({'error': 'You are not authorized to perform this action'}, status=HTTP_401_UNAUTHORIZED)

		return self.destroy(request, pk, format=None)


class CreateTestResultView(PermissionMixin, CreateAPIView):
	serializer_class = TestResultSerializer

	def post(self, request):

		if not self.has_laboratory_permission():

			return Response({'error': 'You are not authorized to perform this action'}, status=HTTP_401_UNAUTHORIZED)

		return self.create(request)


	def perform_create(self, serializer):

		serializer.save(send_by=self.request.user)


class TestResultListView(BranchListView):
	serializer_class = TestResultSerializer

	def get_queryset(self):
		return TestResult.objects.filter(
			Q(branch__branch_manager=self.request.user) | 
			Q(branch__laboratory__created=self.request.user)
		)


class TestResultDetailView(RetrieveAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = TestResultSerializer

	def get_queryset(self, pk):

		try:
			return TestResult.objects.get(pk=pk)

		except TestResult.DoesNotExist:

			return Response({'error': 'result not found'}, status=HTTP_404_NOT_FOUND)

	def get(self, request, pk, format=None):
		
		test_result = self.get_queryset(pk)
		serialized_data = TestResultSerializer(test_result)

		return Response(serialized_data.data)


class TestResultUpdateView(PermissionMixin, UpdateAPIView):
	serializer_class = TestResultSerializer

	def get_queryset(self):
		return TestResult.objects.all()

	def put(self, request, pk, format=None):

		if not self.has_laboratory_permission():

			return Response({'error': 'You are not authorized to perform this action'}, status=HTTP_401_UNAUTHORIZED)

		return self.update(request, pk, format=None)


class TestResultDeleteView(PermissionMixin, DestroyAPIView):

	def get_queryset(self):
		return TestResult.objects.all()

	def delete(self, request, pk, format=None):

		if not self.has_laboratory_permission():

			return Response({'error': 'You are not authorized to perform this action'}, status=HTTP_401_UNAUTHORIZED)

		return self.destroy(request, pk, format=None)


class LaboratorySampleSerializerView(PermissionMixin, CreateAPIView):

	serializer_class = LaboratorySampleSerializer
	parser_classes = (MultiPartParser, FormParser)

	def post(self, request):

		if not self.has_laboratory_permission():

			return Response({'error': 'You are not authorized to perform this action'}, status=HTTP_401_UNAUTHORIZED)
		
		return self.create(request)

	def perform_create(self, serializer):

		sample = serializer.save(send_by=self.request.user)
		tests = self.request.data.getlist('tests')

		sample.tests.add(*tests)



class LaboratorySampleUpdateView(PermissionMixin, UpdateAPIView):
	'''Update details of a specific sample.'''
	serializer_class = LaboratorySampleSerializer

	def put(self, request, pk, format=None):

		return super().put(request, pk, format=None)

	def perform_update(self, serializer):
		sample = serializer.save()
		sample.tests.clear()
		tests = self.request.data.getlist('tests')
		sample.tests.add(*tests)


class LaboratorySampleDeleteView(PermissionMixin, DestroyAPIView):
	'''Delete a specific sample.'''

	def delete(self, request, pk, format=None):

		return super().delete(request, pk, format=None)


class AllLaboratories(ListAPIView):

	serializer_class = BranchSerializer
	queryset = Branch.objects.all()



class HospitalSamplesView(PermissionMixin, ListAPIView):
	serializer_class = SampleSerializer

	def get_queryset(self):
		return Sample.objects.filter(
				Q(lab__laboratory__created_by=self.request.user) |
				Q(lab__branch_manager=self.request.user)
			)


class LaboratorySampleList(PermissionMixin, ListAPIView):
	serializer_class = SampleSerializer

	def get_queryset(self):

		try:
			return LaboratorySample.objects.filter(
				Q(to_lab__branch_manager=self.request.user) | 
				Q(to_lab__laboratory__created_by=self.request.user)
			)

		except LaboratorySample.DoesNotExist:
			return Response({'error': 'No sample sent.'}, status=HTTP_404_NOT_FOUND)