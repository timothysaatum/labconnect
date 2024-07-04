from .models import (
    ClientProfile, 
    #DeliveryUserProfile
)
from .serializers import (
    ClientProfileSerializer,
    #DeliveryUserProfileSerializers
)
from rest_framework.generics import (
	UpdateAPIView
)



class UpdateUserProfile(UpdateAPIView):
    serializer_class = ClientProfileSerializer

    def get_queryset(self):
        return ClientProfile.objects.filter(client=self.request.user).filter(pk=self.kwargs.get('pk'))


    def patch(self, request, pk):

    	#profile =self.get_queryset()

    	return self.partial_update(request, pk)


# class UpdateDeliveryUserProfile(UpdateLabUserProfile):
#     serializer_class = DeliveryUserProfileSerializers

#     def get_queryset(self):
#         return DeliveryUserProfile.objects.filter(client=self.request.user).filter(pk=self.kwargs.get('pk'))
