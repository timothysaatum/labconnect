from rest_framework import serializers
from .models import ClientProfile



class ClientProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = ClientProfile
        fields = [
            'id',
            'client',
            'gender',
            'id_number',
            'digital_address',
            'emmergency_contact',
            'bio'
        ]

    def to_representation(self, instance):
        
        data = super().to_representation(instance)
        data['client'] = instance.client.full_name
        
        return data


# class DeliveryUserProfileSerializers(LabUserProfileSerializer):

#     def to_representation(self, instance):
#         data = super().to_representation(instance)
#         data['client'] = instance.client.full_name
        
#         return data