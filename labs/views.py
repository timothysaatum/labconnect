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
from .models import Test, Branch
from .results import TestResult
from hospital.models import Sample
from hospital.serializers import SampleSerializer
from django.db.models import Q




class PermissionMixin(object):
	permission_classes = [IsAuthenticated]

	def has_laboratory_permission(self):

		return self.request.user.account_type == 'Laboratory' and (
				self.request.user.is_staff or self.request.user.is_superuser or self.request.user.is_admin
			)

	def has_laboratory_permission_to_edit_branch(self, user, branch):
		return (
			user.is_authenticated and
			(
				(user == branch[0].laboratory.created_by) or
				(user == branch[0].branch_manager)
			)
		)


class CreateLaboratoryView(PermissionMixin, CreateAPIView):
	parser_classes = (MultiPartParser, FormParser)
	serializer_class = LaboratorySerializer

	def post(self, request):

		if not self.has_laboratory_permission():

			return Response({'error': 'Your account does not support labs'}, status=HTTP_400_BAD_REQUEST)

		return self.create(request)

	def perform_create(self, serializer):
		serializer.save(created_by=self.request.user)


class CreateBranchView(PermissionMixin, CreateAPIView):
	serializer_class = BranchSerializer

	def post(self, request):

		if not self.has_laboratory_permission():

			return Response({'error': 'Your account does not support labs'}, status=HTTP_400_BAD_REQUEST)

		return self.create(request)


class BranchListView(PermissionMixin, ListAPIView):
	serializer_class = BranchSerializer

	def get_queryset(self):

		return Branch.objects.filter(laboratory__created_by=self.request.user)


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

		branch = self.get_queryset()

		if not self.has_laboratory_permission_to_edit_branch(request.user, branch):

			return Response({'error': 'You are not authorized to perform this action'}, status=HTTP_401_UNAUTHORIZED)

		return self.destroy(request, pk, format=None)


class CreateTestView(PermissionMixin, CreateAPIView):
	serializer_class = TestSerializer

	def post(self, request):

		if not self.has_laboratory_permission():

			return Response({'error': 'Unauthorized action'}, status=HTTP_400_BAD_REQUEST)
		
		return self.create(request)


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

		return self.update(request, pk, format=None)


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


class LaboratorySampleList(ListAPIView):
	permission_classes = [IsAuthenticated]
	serializer_class = SampleSerializer

	def get_queryset(self):

		try:
			return Sample.objects.filter(
				Q(lab__branch_manager=self.request.user) | 
				Q(lab__laboratory__created_by=self.request.user)
			)

		except Sample.DoesNotExist:
			return Response({'error': 'Test results not found'}, status=HTTP_404_NOT_FOUND)


class AllLaboratories(ListAPIView):

	serializer_class = BranchSerializer
	queryset = Branch.objects.all()
