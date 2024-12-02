from rest_framework import serializers
from .models import Hospital, HospitalLab, HospitalLabTest


class HospitalSerializer(serializers.ModelSerializer):
    facility_type = serializers.CharField(max_length=100,required=False)

    class Meta:

        model = Hospital

        fields = (
            "id",
            "name",
            "region",
            "town",
            "facility_type",
            "hospital_type",
            "digital_address",
            "phone",
            "email",
            "website",
            "date_modified",
            "date_added",
        )


class HospitalLabSerializer(serializers.ModelSerializer):
    hospital_reference = serializers.PrimaryKeyRelatedField(queryset=Hospital.objects.all(), required=False)
    class Meta:

        model = HospitalLab

        fields = (
			'id', 
			'name',
			'accreditation_number',
			'level',
			'postal_address',
			'phone',
			'email',
			'hospital_reference',
			'date_modified',
			'date_added'
		)

    def to_representation(self, instance):

        data = super().to_representation(instance)
        data['hospital_reference'] = instance.hospital_reference.name

        return data


class HospitalLabTestSerializer(serializers.ModelSerializer):

    hospital_lab = serializers.PrimaryKeyRelatedField(queryset=HospitalLab.objects.all(), required=False)

    class Meta:

        model = HospitalLabTest

        fields = (
            "id",
            "test_code",
            "name",
            "turn_around_time",
            "price",
            "patient_preparation",
            "sample_type",
            "hospital_type" "hospital_lab",
            "test_status",
            "date_modified",
            "date_added",
        )

    def to_representation(self, instance):

        data = super().to_representation(instance)
        data['hospital_lab'] = instance.hospital_lab.name

        return data
