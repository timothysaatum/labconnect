from .serializers import (LaboratorySerializer, TestSerializer, TestResultSerializer, BranchSerializer)
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView, RetrieveAPIView, DestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Laboratory, Test, Branch
from .results import TestResult
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


class CreateBranchView(CreateAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = BranchSerializer

	def post(self, request):
	
		serializer = self.serializer_class(data=request.data)

		if serializer.is_valid(raise_exception=True):

			if self.request.user.account_type == 'Laboratory' and self.request.user.is_admin:

				serializer.save()

				return Response({'message': 'Branch created successfully.'},
							status=status.HTTP_200_OK)

			return Response({'error': 'Your account does not support labs'}, status=status.HTTP_400_BAD_REQUEST)

		return Response({'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)



class BranchListView(ListAPIView):

	'''
	This API end point call list all the branches that a user has added to their lab
	when the user is logged into their account.

	This is different from the the AllBranches end point which list all the branches
	that are available in the system.
	'''

	permission_classes = [IsAuthenticated]
	serializer_class = BranchSerializer

	def get_queryset(self):

		try:
			return Branch.objects.filter(branch_manager=self.request.user)
			
		except Branch.DoesNotExist:
			return Response({'error': 'Laboratory not found'}, status=status.HTTP_404_NOT_FOUND)


class BranchDetailView(RetrieveAPIView):

	serializer_class = BranchSerializer

	def get_queryset(self, pk):

		try:
			return Branch.objects.get(pk=pk)

		except Branch.DoesNotExist:

			return Response({'error': 'Laboratory does not exist.'})

		except Exception as e:

			return Response({'error': str(e)})


	def get(self, request, pk, format=None):

		try:

			lab = self.get_queryset(pk)
			serialized_data = BranchSerializer(lab)

			return Response(serialized_data.data)

		except Exception as e:

			return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)


class BranchUpdateView(UpdateAPIView):

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


class BranchDeleteView(DestroyAPIView):

	permission_classes = [IsAuthenticated]

	def delete(self, request, pk, format=None):

		lab = Branch.objects.filter(laboratory__created_by=self.request.user).get(pk=pk)
		if self.request.user.is_admin and self.request.user.account_type == 'Laboratory':

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
			return Test.objects.filter(branch__id=self.kwargs.get('pk'))

		except Test.DoesNotExist:
			return Response({'error': 'Test not found'}, status=status.HTTP_404_NOT_FOUND)


class TestUpdateView(UpdateAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = TestSerializer

	def put(self, request, pk, format=None):

		test = Test.objects.filter(branch__branch_manager=self.request.user).get(pk=pk)
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

		test = Test.objects.filter(branch__branch_manager=self.request.user).get(pk=pk)
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
			return TestResult.objects.filter(branch__branch_manager=self.request.user)

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
			return Sample.objects.filter(lab__branch_manager=self.request.user)

		except Sample.DoesNotExist:
			return Response({'error': 'Test results not found'}, status=status.HTTP_404_NOT_FOUND)


class AllLaboratories(ListAPIView):

	serializer_class = BranchSerializer

	def get_queryset(self):

		try:
			return Branch.objects.all()

		except Branch.DoesNotExist:
			return Response({'error': 'No labaratory added yet'}, status=status.HTTP_404_NOT_FOUND)
