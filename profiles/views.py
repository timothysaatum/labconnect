from django.shortcuts import render
from .models import (
    HealthWorkerProfile, 
    LabUserProfile, 
    DeliveryUserProfile
)
from .serializers import (
    HealthWorkerProfileSerializer,
    LabUserProfileSerializer,
    DeliveryUserProfileSerializers
)

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import (
	DestroyAPIView, 
	RetrieveAPIView,
	UpdateAPIView
)
from rest_framework.status import (
		HTTP_200_OK,
		HTTP_201_CREATED,
		HTTP_400_BAD_REQUEST,
		HTTP_401_UNAUTHORIZED,
		HTTP_404_NOT_FOUND
	)


class UpdateHealthWorkerProfile(UpdateAPIView):
    permission_classes =  [IsAuthenticated]
    serializer_class = HealthWorkerProfileSerializer

    def get_queryset(self):
        return HealthWorkerProfile.objects.filter(client=self.request.user).filter(pk=self.kwargs.get('pk'))

    def put(self, request, pk, format=None):
        
        profile = self.get_queryset()
        
        return self.update(request, pk, format=None)


class UpdateLabUserProfile(UpdateHealthWorkerProfile):
    serializer_class = LabUserProfileSerializer

    def get_queryset(self):
        return LabUserProfile.objects.filter(client=self.request.user).filter(pk=self.kwargs.get('pk'))


class UpdateDeliveryUserProfile(UpdateHealthWorkerProfile):
    serializer_class = DeliveryUserProfileSerializers

    def get_queryset(self):
        return DeliveryUserProfile.objects.filter(client=self.request.user).filter(pk=self.kwargs.get('pk'))