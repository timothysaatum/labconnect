from rest_framework import serializers
from .models import Hospital, HospitalLab, HospitalLabTest
from modelmixins.utils import get_gps_coords
from transactions.utils import create_customer_subaccount


class HospitalSerializer(serializers.ModelSerializer):
    facility_type = serializers.CharField(max_length=100,required=False)
    account_number = serializers.CharField(write_only=True, required=False)
    bank_name = serializers.CharField(write_only=True, required=False)
    bank_code = serializers.CharField(write_only=True, required=False)
    gps_coordinates = serializers.CharField(read_only=True)

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
            'gps_coordinates',
            "phone",
            "email",
            "account_number",
            "bank_name",
            "bank_code",
            "website",
            "date_modified",
            "date_added",
        )

    # def update(self, instance, validated_data):
        
    #     instance = super().update(instance, validated_data)
    #     if "digital_address" in validated_data and validated_data["digital_address"]:
    #         print("Running")
    #         get_gps_coords(validated_data["digital_address"])
        
    #     if "account_number" in validated_data and validated_data["account_number"]:
    #         print("Running")
    #         create_customer_subaccount(instance)


class HospitalLabSerializer(serializers.ModelSerializer):
    hospital_reference = serializers.PrimaryKeyRelatedField(queryset=Hospital.objects.all(), required=False)
    account_number = serializers.CharField(write_only=True, required=False)
    bank_name = serializers.CharField(write_only=True, required=False)
    bank_code = serializers.CharField(write_only=True, required=False)
    gps_coordinates = serializers.CharField(read_only=True)



    class Meta:

        model = HospitalLab

        fields = (
			'id', 
			'name',
            "account_number",
            "bank_name",
            "bank_code",
			'accreditation_number',
			'level',
			'postal_address',
            'gps_coordinates',
			'phone',
			'email',
			'hospital_reference',
			'date_modified',
			'date_added'
		)
    
    # def update(self, instance, validated_data):
        
    #     instance = super().update(instance, validated_data)
    #     if "digital_address" in validated_data and validated_data["digital_address"]:
    #         print("Running")
    #         get_gps_coords(validated_data["digital_address"])
        
    #     if "account_number" in validated_data and validated_data["account_number"]:
    #         print("Running")
    #         create_customer_subaccount(instance)


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
