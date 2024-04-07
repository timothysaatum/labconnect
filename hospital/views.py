from django.shortcuts import render
from .serializers import (HospitalSerializer, WardSerializer, SampleSerializer)
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView, RetrieveAPIView, DestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
#from rest_framework_simplejwt.authentication import JWTAuthentication


class HospitalSerializerView(CreateAPIView):


	#permission_classes = [IsAuthenticated]
	parser_classes = (MultiPartParser, FormParser)
	serializer_class = HospitalSerializer

	def post(self, request):

		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid(raise_exception=True):
			print(self.request.user)
			serializer.save()
			#serializer.save(created_by=self.request.user)

		return Response({
					'message': 'Hospital created successfully.'},
					status=status.HTTP_200_OK)


class WardSerializerView(CreateAPIView):

	serializer_class = WardSerializer

	def post(self, request):

		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid(raise_exception=True):
			
			serializer.save()

		return Response(
					{'message': 'Ward added successfully.'},
					status=status.HTTP_200_OK)


class SampleSerializerView(CreateAPIView):

	serializer_class = SampleSerializer
	parser_classes = (MultiPartParser, FormParser)

	def post(self, request):

		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid(raise_exception=True):

			serializer.save()

		return Response(
				{'message': 'Sample added successfully.'},
				status=status.HTTP_200_OK
			)