from .serializers import (LaboratorySerializer, DepartmentSerializer, TestSerializer, TestResultSerializer, BranchSerializer)
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView, RetrieveAPIView, DestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Laboratory, Department, Test, Branch
from .results import TestResult
from rest_framework_simplejwt.exceptions import InvalidToken
from hospital.models import Sample
from hospital.serializers import SampleSerializer



class CreateLaboratoryView(CreateAPIView):

	permission_classes = [IsAuthenticated]
	parser_classes = (MultiPartParser, FormParser)
	serializer_class = LaboratorySerializer

	def post(self, request):
	
		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid(raise_exception=True):
			if self.request.user.account_type == 'Laboratory':

				serializer.save(created_by=self.request.user)

				return Response({'message': 'Laboratory created successfully.'},
							status=status.HTTP_200_OK)

			return Response({'error': 'Your account does not support labs'}, status=status.HTTP_400_BAD_REQUEST)

		return Response({'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class LaboratoryListView(ListAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = BranchSerializer

	def get_queryset(self):

		try:
			return Branch.objects.filter(laboratory__created_by=self.request.user)
			
		except Branch.DoesNotExist:
			return Response({'error': 'Laboratory not found'}, status=status.HTTP_404_NOT_FOUND)


class LaboratoryDetailView(RetrieveAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = BranchSerializer

	def get_queryset(self, pk, user):

		try:
			return Branch.objects.filter(laboratory__created_by=user).get(pk=pk)

		except Branch.DoesNotExist:

			return Response({'error': 'Laboratory does not exist.'})

		except Exception as e:

			return Response({'error': str(e)})


	def get(self, request, pk, format=None):

		try:

			lab = self.get_queryset(pk, self.request.user)
			serialized_data = BranchSerializer(lab)

			return Response(serialized_data.data)

		except Exception as e:

			return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)


class LaboratoryUpdateView(UpdateAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = BranchSerializer

	def put(self, request, pk, format=None):

		lab = Branch.objects.filter(laboratory__created_by=self.request.user).get(pk=pk)
		serializer = BranchSerializer(lab, data=request.data)

		if serializer.is_valid():
			if self.request.user.is_admin and self.request.user.account_type == 'Laboratory':

				serializer.save()
				return Response({'message': 'Updated'},status=status.HTTP_201_CREATED)

			return Response({'error': 'You are no authorized to edit labaratory details!'},
							status=status.HTTP_401_UNAUTHORIZED)

		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LaboratoryDeleteView(DestroyAPIView):

	permission_classes = [IsAuthenticated]

	def delete(self, request, pk, format=None):

		lab = Branch.objects.filter(laboratory__created_by=self.request.user).get(pk=pk)
		if self.request.user.is_admin and self.request.user.account_type == 'Laboratory':

			lab.delete()
			return Response({'message': 'delete successful'}, status=status.HTTP_204_NO_CONTENT)

		return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


class DepartmentSerializerView(CreateAPIView):

	permission_classes = [IsAuthenticated]

	serializer_class = DepartmentSerializer

	def post(self, request):

		serializer = self.serializer_class(data=request.data)

		if serializer.is_valid(raise_exception=True):

			serializer.save()

		return Response({'message': 'Department added successfully.'}, status=status.HTTP_200_OK)


class DepartmentListView(ListAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = DepartmentSerializer

	def get_queryset(self):

		try:
			return Department.objects.filter(branch__branch_manager=self.request.user)

		except Department.DoesNotExist:
			return Response({'error': 'Department not found'}, status=status.HTTP_404_NOT_FOUND)


class DepartmentDetailView(RetrieveAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = DepartmentSerializer

	def get_queryset(self, pk, user):

		try:
			return Department.objects.filter(branch__branch_manager=user).get(pk=pk)

		except Department.DoesNotExist:

			return Response({'error': 'Department does not exist!'}, status=status.HTTP_404_NOT_FOUND)

		except Exception as e:

			return Response({'erroe': str(e)}, status=status.HTTP_400_BAD_REQUEST)


	def get(self, request, pk, format=None):
	
		try:
			department = self.get_queryset(pk, self.request.user)
			serialized_data = DepartmentSerializer(department)

			return Response(serialized_data.data)
		except Exception as e:
			
			return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
		

class DepartmentUpdateView(UpdateAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = DepartmentSerializer

	def put(self, request, pk, format=None):

		department = Department.objects.filter(branch__branch_manager=self.request.user).get(pk=pk)
		serializer = DepartmentSerializer(department, data=request.data)

		if serializer.is_valid():
			if self.request.user.is_staff and self.request.user.account_type == 'Laboratory':
				serializer.save()
				return Response({'message': 'Updated'},status=status.HTTP_201_CREATED)

			return Response({'error': 'You are no authorized to edit department details!'}, 
				status=status.HTTP_401_UNAUTHORIZED)

		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DepartmentDeleteView(DestroyAPIView):

	permission_classes = [IsAuthenticated]

	def delete(self, request, pk, format=None):

		lab = Department.objects.filter(branch__branch_manager=self.request.user).get(pk=pk)
		if self.request.user.is_staff and self.request.user.account_type == 'Laboratory':
			lab.delete()
			return Response({'message': 'delete successful'}, status=status.HTTP_204_NO_CONTENT)

		return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


class CreateTestView(CreateAPIView):

	serializer_class = TestSerializer
	permission_classes = [IsAuthenticated]

	def post(self, request):

		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid(raise_exception=True):

			serializer.save()

		return Response(
				{'message': 'Test added successfully.'},
				status=status.HTTP_200_OK
			)


class TestListView(ListAPIView):

	serializer_class = TestSerializer

	def get_queryset(self):

		try:
			return Test.objects.filter(department__branch__id=self.kwargs.get('pk'))

		except Test.DoesNotExist:
			return Response({'error': 'Test not found'}, status=status.HTTP_404_NOT_FOUND)


class TestUpdateView(UpdateAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = TestSerializer

	def put(self, request, pk, format=None):

		test = Test.objects.filter(department__heard_of_department=self.request.user).get(pk=pk)
		serializer = TestSerializer(test, data=request.data)

		if serializer.is_valid():

			if self.request.user.is_admin and self.request.user.account_type == 'Laboratory':

				serializer.save()

				return Response({'message': 'Updated'},status=status.HTTP_201_CREATED)

			return Response({'error': 'You are no authorized to edit labaratory details!'}, 
							status=status.HTTP_401_UNAUTHORIZED)

		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TestDeleteView(DestroyAPIView):

	permission_classes = [IsAuthenticated]

	def delete(self, request, pk, format=None):

		test = Test.objects.filter(department__heard_of_department=self.request.user).get(pk=pk)
		if self.request.user.is_admin and self.request.user.account_type == 'Laboratory':
			test.delete()
			return Response({'message': 'delete successful'}, status=status.HTTP_204_NO_CONTENT)

		return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


class CreateTestResultView(CreateAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = TestResultSerializer

	def post(self, request):
		if self.request.user.account_type == 'Laboratory':
			serializer = self.serializer_class(data=request.data)
			if serializer.is_valid(raise_exception=True):

				serializer.save(send_by=self.request.user)

			return Response(
					{'message': 'Test results added successfully.'},
					status=status.HTTP_200_OK
				)
		return Response({'error': 'You account does not support result upload'})


class TestResultListView(ListAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = TestResultSerializer

	def get_queryset(self):

		try:
			return TestResult.objects.filter(department__heard_of_department=self.request.user)

		except TestResult.DoesNotExist:
			return Response({'error': 'Test results not found'}, status=status.HTTP_404_NOT_FOUND)


class TestResultDetailView(RetrieveAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = TestResultSerializer

	def get_queryset(self, pk):

		try:
			return TestResult.objects.get(pk=pk)

		except TestResult.DoesNotExist:

			return Response({'error': 'result not found'}, status=status.HTTP_404_NOT_FOUND)

		except Exception as e:

			return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


	def get(self, request, pk, format=None):
		
		test_result = self.get_queryset(pk)
		serialized_data = TestResultSerializer(test_result)

		return Response(serialized_data.data)
		

class TestResultUpdateView(UpdateAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = TestResultSerializer

	def put(self, request, pk, format=None):

		result = TestResult.objects.get(pk=pk)
		serializer = TestResultSerializer(result, data=request.data)

		if serializer.is_valid():
			if self.request.user.is_staff and self.request.user.account_type == 'Laboratory':
				serializer.save()
				return Response({'message': 'Updated'},status=status.HTTP_201_CREATED)

			return Response({'error': 'You are no authorized to edit result details!'}, 
				status=status.HTTP_401_UNAUTHORIZED)

		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TestResultDeleteView(DestroyAPIView):

	permission_classes = [IsAuthenticated]

	def delete(self, request, pk, format=None):

		result = TestResult.objects.get(pk=pk)

		if self.request.user.is_staff and self.request.user.account_type == 'Laboratory':

			result.delete()
			return Response({'message': 'delete successful'}, status=status.HTTP_204_NO_CONTENT)

		return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


class LaboratorySampleList(ListAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = SampleSerializer

	def get_queryset(self):

		try:
			return Sample.objects.filter(department__heard_of_department=self.request.user)

		except Sample.DoesNotExist:
			return Response({'error': 'Test results not found'}, status=status.HTTP_404_NOT_FOUND)


class AllBranches(ListAPIView):

	serializer_class = BranchSerializer

	def get_queryset(self):

		try:
			return Branch.objects.all()

		except Branch.DoesNotExist:
			return Response({'error': 'No labaratory added yet'}, status=status.HTTP_404_NOT_FOUND)
