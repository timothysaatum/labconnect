from rest_framework import serializers # type: ignore
from sample.models import (
      Sample, 
      Notification, 
      SampleTrackingHistory, 
      Referral,
      SampleTest
      )
from django.db import transaction
from labs.models import Test
from modelmixins.models import Facility, SampleType
from modelmixins.serializers import SampleTypeSerializer


class SampleTestSerializer(serializers.ModelSerializer):

    sample = serializers.PrimaryKeyRelatedField(
        queryset=Sample.objects.all(), required=True
    )
    test = serializers.PrimaryKeyRelatedField(
        queryset=Test.objects.all(), required=True
    )
    status = serializers.CharField(required=False)
    result = serializers.URLField(required=False)


    class Meta:

        model = SampleTest

        fields = (
            "id",
            "sample",
            "test",
            "status",
            'result',
            "date_completed",
        )

    def to_representation(self, instance):

        data = super().to_representation(instance)
        data["test"] = str(instance.test.name)

        return data


class SampleSerializer(serializers.ModelSerializer):

    referral = serializers.PrimaryKeyRelatedField(
        queryset=Referral.objects.all(), required=False
    )
    sample_type = serializers.PrimaryKeyRelatedField(
        queryset=SampleType.objects.all(), required=False
    )
    rejection_reason = serializers.CharField(required=False)
    sample_status = serializers.CharField(required=False)
    sample_tests = serializers.ListField(write_only=True)
    sample_tests_data = serializers.PrimaryKeyRelatedField(
        read_only=True, required=False
    )

    class Meta:

        model = Sample

        fields = (
            "id",
            "sample_type",
            "sample_tests",
            "referral",
            "sample_status",
            "rejection_reason",
            "date_modified",
            "date_collected",
            'sample_tests_data'
        )

    def create(self, validated_data):
        sample_tests_data = validated_data.pop('sample_tests')
        sample = Sample.objects.create(**validated_data)

        # Creating SampleTest entries
        for sample_test_data in sample_tests_data:
            SampleTest.objects.create(sample=sample, test_id=sample_test_data)

        return sample

    def update(self, instance, validated_data):
        print(validated_data)
        sample_tests_data = validated_data.pop("sample_tests", None)

        for attr, value in validated_data.items():
            # print(instance)
            setattr(instance, attr, value)

        print(instance.sample_status)

        instance.save()

        # Wrap the sample and sample_test updates in a transaction
        if sample_tests_data is not None:

            with transaction.atomic():
                # Update existing samples or create new ones
                for sample_test in sample_tests_data:
                    _, created = SampleTest.objects.update_or_create(
                        id=sample_test.get("id"),  # Find by ID if it exists
                        sample=instance,  # Always associate it with the current referral
                        defaults={
                            "result": sample_test.get("result"),
                            "status": sample_test.get("status"),
                            "test": sample_test.get("test"),
                        },
                    )

        return instance

    def to_representation(self, instance):

        data = super().to_representation(instance)
        data["referral"] = str(instance.referral)
        data["sample_type"] = SampleTypeSerializer(instance.sample_type).data
        data["sample_tests_data"] = SampleTestSerializer(instance.sample_tests.all(), many=True).data

        return data


class ReferralSerializer(serializers.ModelSerializer):
    to_laboratory = serializers.PrimaryKeyRelatedField(
        queryset=Facility.objects.all(), required=True
    )
    clinical_history = serializers.CharField(required=False)
    requires_phlebotomist = serializers.BooleanField(required=False)
    sender_full_name = serializers.CharField(required=False)
    sender_phone = serializers.CharField(required=False)
    sender_email = serializers.EmailField(required=False)
    referral_status = serializers.CharField(required=False)
    referring_facility = serializers.PrimaryKeyRelatedField(
        queryset=Facility.objects.all(), required=True
    )
    samples = SampleSerializer(many=True, required=False)
    attachment = serializers.URLField(required=False)
    facility_type = serializers.CharField(read_only=True)

    class Meta:
        model = Referral

        fields = (
            "id",
            'referral_id',
            "referring_facility",
            "facility_type",
            "to_laboratory",
            "delivery",
            "patient_name",
            "patient_sex",
            "patient_age",
            "clinical_history",
            "requires_phlebotomist",
            "sender_full_name",
            "sender_phone",
            "sender_email",
            "referral_status",
            "attachment",
            "date_referred",
            "samples"
        )

    def create(self, validated_data):

        samples_data = validated_data.pop("samples")
        referral = Referral.objects.create(**validated_data)

        # Creating Sample entries
        for sample_data in samples_data:

            sample_tests_data = sample_data.pop("sample_tests")
            sample = Sample.objects.create(referral=referral, sample_type=sample_data.get("sample_type"))

            # Creating SampleTest entries for each sample
            for sample_test_data in sample_tests_data:
                SampleTest.objects.create(sample=sample, test_id=sample_test_data)

        return referral
    

    def update(self, instance, validated_data):
        samples_data = validated_data.pop("samples")

        # Update the instance with validated_data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        # Wrap the sample and sample_test updates in a transaction
        with transaction.atomic():
            # Update existing samples or create new ones
            for sample_data in samples_data:
                sample, _ = Sample.objects.update_or_create(
                    id=sample_data.get('id'),  # Find by ID if it exists
                    referral=instance,  # Always associate it with the current referral
                    defaults={
                        "sample_type": sample_data.get("sample_type"),
                        "sample_status": sample_data.get("sample_status"),
                        "rejection_reason": sample_data.get("rejection_reason"),
                    },
                )

                # Now update the sample tests for the sample
                for sample_test_data in sample_data["sample_tests"]:
                    SampleTest.objects.update_or_create(
                        sample=sample,  # Always associate with the current sample
                        test_id=sample_test_data.get("test"),  # Use test ID to match
                        defaults={
                            "result": sample_test_data.get("result"),
                            "status": sample_test_data.get("status"),
                            "sample_tests": sample_test_data.get("sample_tests"),
                            "sample_type": sample_test_data.get("sample_type"),
                        },
                    )

        return instance

    def to_representation(self, instance):

        data = super().to_representation(instance)

        data["referring_facility"] = str(instance.referring_facility)
        data["to_laboratory"] = str(instance.to_laboratory)

        return data


class NotificationSerializer(serializers.ModelSerializer):

    facility = serializers.PrimaryKeyRelatedField(queryset=Facility.objects.all(), required=False)
    message = serializers.CharField(required=False)
    title = serializers.CharField(required=False)
    is_read = serializers.BooleanField(default=False)
    is_hidden = serializers.BooleanField(default=False)

    class Meta:
 
        model = Notification

        fields = (
			'id', 
			'facility',
			'title',
			'message',
			'is_read',
			'is_hidden',
			'date_added',
			'date_modified'
		)

    def to_representation(self, instance):

        data = super().to_representation(instance)
        data['facility'] = str(instance.facility)

        return data


class SampleTrackingSerializer(serializers.ModelSerializer):
    
    sample = serializers.PrimaryKeyRelatedField(queryset=Sample.objects.all(), required=False)
    location = serializers.CharField(required=False)
    
    class Meta:
        
        model = SampleTrackingHistory
        
        fields = (
			'id', 
			'sample', 
			'status',
			'location',
			'updated_at'
		)


    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['sample'] = str(instance.sample)

        return data


class CountObjectsSerializer(serializers.Serializer):

	pending = serializers.IntegerField(read_only=True)
	received = serializers.IntegerField(read_only=True)
	rejected = serializers.IntegerField(read_only=True)
	processed = serializers.IntegerField(read_only=True)
	# growth = serializers.BooleanField(default=False)
	change_received = serializers.FloatField(read_only=True)
	change_processed = serializers.FloatField(read_only=True)
	change_pending = serializers.FloatField(read_only=True)
	change_rejected = serializers.FloatField(read_only=True)

	class Meta:

		fields = (
			'pending',
			'received',
			'rejected',
			'processed',
			# 'growth',
			'change_received',
			'change_processed',
			'change_pending',
			'change_rejected'
		)
