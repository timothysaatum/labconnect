from django.shortcuts import render
from .serializers import (LaboratorySerializer, DepartmentSerializer, TestSerializer, TestResultSerializer)
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView, RetrieveAPIView, DestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
#from rest_framework_simplejwt.authentication import JWTAuthentication


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


class DepartmentSerializerView(CreateAPIView):

	serializer_class = DepartmentSerializer

	def post(self, request):

		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid(raise_exception=True):
			
			serializer.save()

		return Response(
					{'message': 'Department added successfully.'},
					status=status.HTTP_200_OK)


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