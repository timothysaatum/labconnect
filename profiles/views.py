from django.shortcuts import render
from .models import (
    LabUserProfile, 
    DeliveryUserProfile
)
from .serializers import (
    LabUserProfileSerializer,
    DeliveryUserProfileSerializers
)
from rest_framework.generics import (
	UpdateAPIView
)



class UpdateLabUserProfile(UpdateAPIView):
    serializer_class = LabUserProfileSerializer

    def get_queryset(self):
        return LabUserProfile.objects.filter(client=self.request.user).filter(pk=self.kwargs.get('pk'))


    def put(self, request, pk, format=None):

    	#profile =self.get_queryset()

    	return self.update(request, pk, format=None)


class UpdateDeliveryUserProfile(UpdateLabUserProfile):
    serializer_class = DeliveryUserProfileSerializers

    def get_queryset(self):
        return DeliveryUserProfile.objects.filter(client=self.request.user).filter(pk=self.kwargs.get('pk'))
