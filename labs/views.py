from django.shortcuts import render
from .serializers import (LaboratorySerializer, DepartmentSerializer, TestSerializer, TestResultSerializer)
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView, RetrieveAPIView, DestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


class CreateLaboratoryView(CreateAPIView):

	#permission_classes = [IsAuthenticated]
	serializer_class = LaboratorySerializer

	def post(self, request):

		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid(raise_exception=True):
			#print(serializer.created_by)
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

		return Response({
					'message': 'Department created successfully.'},
					status=status.HTTP_200_OK)


