from django.shortcuts import render
from .serializers import (LaboratorySerializer, DepartmentSerializer, TestSerializer, TestResultSerializer, 
	LaboratoryDetailViewSerializer)
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView, RetrieveAPIView, DestroyAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Laboratory, Department, Test, TestResult
from django.http import Http404


class CreateLaboratoryView(CreateAPIView):


	#permission_classes = [IsAuthenticated]
	parser_classes = (MultiPartParser, FormParser)
	serializer_class = LaboratorySerializer

	def post(self, request):

		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid(raise_exception=True):
			print(self.request.user)
			serializer.save()
			#serializer.save(created_by=self.request.user)

		return Response({
					'message': 'Laboratory created successfully.'},
					status=status.HTTP_200_OK)



'''
A detail, update and delete view that allows the user to perform multiple action,
Since the pk of the object is need to perform update and delete action, it is reasonable
to do so in the detail view
'''
class LaboratoryDetailView(APIView):

	def get_object(self, pk):

		try:
			return Laboratory.objects.get(pk=pk)
		except Laboratory.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):

		lab = self.get_object(pk)
		serializer = LaboratorySerializer(lab)

		return Response(serializer.data)


	def put(self, request, pk, format=None):

		lab = self.get_object(pk)
		serializer = LaboratorySerializer(lab, data=request.data)

		if serializer.is_valid():
			serializer.save()
			return Response({'message': 'Updated'},status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, pk, format=None):

		lab = self.get_object(pk)
		lab.delete()
		return Response({'message': 'delete successful'}, status=status.HTTP_204_NO_CONTENT)




class DepartmentSerializerView(CreateAPIView):

	serializer_class = DepartmentSerializer

	def post(self, request):

		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid(raise_exception=True):
			
			serializer.save()

		return Response(
					{'message': 'Department added successfully.'},
					status=status.HTTP_200_OK)




class DepartmentDetailView(APIView):

	def get_object(self, pk):

		try:
			return Department.objects.get(pk=pk)
		except Department.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):

		department = self.get_object(pk)
		serializer = DepartmentSerializer(department)

		return Response(serializer.data)


	def put(self, request, pk, format=None):

		department = self.get_object(pk)
		serializer = DepartmentSerializer(department, data=request.data)

		if serializer.is_valid():
			serializer.save()
			return Response({'message': 'Updated'},status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, pk, format=None):

		department = self.get_object(pk)
		department.delete()

		return Response({'message': 'delete successful'}, status=status.HTTP_204_NO_CONTENT)




class CreateTestView(CreateAPIView):

	serializer_class = TestSerializer

	def post(self, request):

		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid(raise_exception=True):

			serializer.save()

		return Response(
				{'message': 'Test added successfully.'},
				status=status.HTTP_200_OK
			)




class TestDetailView(APIView):

	def get_object(self, pk):

		try:
			return Test.objects.get(pk=pk)
		except Test.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):

		test = self.get_object(pk)
		serializer = TestSerializer(test)

		return Response(serializer.data)


	def put(self, request, pk, format=None):

		test = self.get_object(pk)
		serializer = TestSerializer(test, data=request.data)

		if serializer.is_valid():

			serializer.save()
			return Response({'message': 'Updated'},status=status.HTTP_201_CREATED)

		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, pk, format=None):

		test = self.get_object(pk)
		test.delete()

		return Response({'message': 'delete successful'}, status=status.HTTP_204_NO_CONTENT)



class CreateTestResultView(CreateAPIView):

	serializer_class = TestResultSerializer

	def post(self, request):

		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid(raise_exception=True):

			serializer.save()

		return Response(
				{'message': 'Test results added successfully.'},
				status=status.HTTP_200_OK
			)



class TestResultDetailView(APIView):

	def get_object(self, pk):

		try:
			return TestResult.objects.get(pk=pk)
		except TestResult.DoesNotExist:
			raise Http404

	def get(self, request, pk, format=None):

		result = self.get_object(pk)
		serializer = TestResultSerializer(result)

		return Response(serializer.data)


	def put(self, request, pk, format=None):

		result = self.get_object(pk)
		serializer = TestResultSerializer(result, data=request.data)

		if serializer.is_valid():

			serializer.save()
			return Response({'message': 'Updated'},status=status.HTTP_201_CREATED)

		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, pk, format=None):

		result = self.get_object(pk)
		result.delete()

		return Response({'message': 'delete successful'}, status=status.HTTP_204_NO_CONTENT)