from rest_framework import serializers
from hospital.models import Hospital
from .models import HealthWorkerProfile, LabUserProfile, DeliveryUserProfile


class HealthWorkerProfileSerializer(serializers.ModelSerializer):
    affiliated_facilities = serializers.PrimaryKeyRelatedField(many=True, queryset=Hospital.objects.all())

    class Meta:
        model = HealthWorkerProfile

        fields = [
            'id',
            'client',
            'affiliated_facilities',
            'specialty',
            'gender',
            'id_number',
            'digital_address',
            'emmergency_contact',
            'bio'
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['client'] = instance.client.full_name
        data['affiliated_facilities'] = [facility.name for facility in instance.facilities.all()]
        
        return data


class LabUserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = LabUserProfile
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


class DeliveryUserProfileSerializers(LabUserProfileSerializer):

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['client'] = instance.client.full_name
        
        return data