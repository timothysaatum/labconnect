from django.shortcuts import render
from .models import Sample
from hospital.models import Facility
from .serializers import SampleSerializer
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



class CreateSampleView(CreateAPIView):
	permission_classes = [IsAuthenticated]
	serializer_class = SampleSerializer
	parser_classes = (MultiPartParser, FormParser)

	def post(self, request):

		if not self.request.user.is_authenticated:

			return Response({'error': 'You are not authorized to perform this action'}, status=HTTP_401_UNAUTHORIZED)
		
		return self.create(request)

	def perform_create(self, serializer):
		facility = Facility.objects.get(created_by=self.request.user)
		sample = serializer.save(referring_facility=facility)
		tests = self.request.data.getlist('tests')

		sample.tests.add(*tests)