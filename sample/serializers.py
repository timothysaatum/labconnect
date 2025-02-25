from rest_framework import serializers
from sample.models import (
      Sample,
      Notification,
      SampleTrackingHistory,
      Referral,
      SampleTest,
      ReferralTrackingHistory
      )
from django.utils import timezone
from django.db import transaction
from django.db.models import Q
from labs.models import Test
from modelmixins.models import Facility, SampleType
from modelmixins.serializers import SampleTypeSerializer
from transactions.utils import transfer_funds_to_lab



class SampleTestSerializer(serializers.ModelSerializer):

    sample = serializers.PrimaryKeyRelatedField(
        queryset=Sample.objects.all(), required=True
    )
    test = serializers.PrimaryKeyRelatedField(
        queryset=Test.objects.all(), required=True
    )
    cost = serializers.DecimalField(decimal_places=2, max_digits=10,read_only=True)
    status = serializers.CharField(required=False)
    result = serializers.URLField(required=False)

    class Meta:

        model = SampleTest

        fields = (
            "id",
            "sample",
            "test",
            "cost",
            "status",
            "result",
            "date_completed",
        )

    def to_representation(self, instance):

        data = super().to_representation(instance)
        data["test"] = str(instance.test.name)
        data['cost'] = instance.test.price

        return data


class SampleSerializer(serializers.ModelSerializer):

    referral = serializers.PrimaryKeyRelatedField(
        queryset=Referral.objects.all(), required=False
    )
    sample_type = serializers.PrimaryKeyRelatedField(
        queryset=SampleType.objects.all(), required=False
    )
    rejection_reason_code = serializers.ListField(
        child=serializers.ChoiceField(choices=Sample.REJECTION_REASONS),
        write_only=True, required=False, allow_null=True
    )
    rejection_reason = serializers.CharField(required=False, allow_null=True, allow_blank=True)
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
            "rejection_reason_code",
            "rejection_reason",
            "date_modified",
            "date_collected",
            "sample_tests_data",
        )


    def validate(self, data):
        """Ensure at least one rejection reason is provided when rejecting a sample."""
        if data.get("sample_status") == "Rejected":
            if not data.get("rejection_reason_code") and not data.get("rejection_reason"):
                raise serializers.ValidationError("A rejection reason must be provided.")

        return data

    def create(self, validated_data):

        sample_tests_data = validated_data.pop('sample_tests')
        sample = Sample.objects.create(**validated_data)

        # Creating SampleTest entries
        for sample_test_data in sample_tests_data:
            SampleTest.objects.create(sample=sample, test_id=sample_test_data)

        return sample

    def update(self, instance, validated_data):

        sample_tests_data = validated_data.pop("sample_tests", None)

        for attr, value in validated_data.items():

            setattr(instance, attr, value)

        instance.save()

        if instance.sample_status == "Received" or instance.sample_status == "Rejected":

            referral = instance.referral
            total_amount = float(sum(sample_test.test.price for sample_test in instance.sample_tests.all()))
            print(total_amount)
            if instance.sample_status == "Received":
                transfer_funds_to_lab(
                        referral.to_laboratory.subaccount_id,
                        total_amount,
                        f"Being Payment for : {str(referral)} lab works",
                        parent=referral.to_laboratory.id
                    )
            ReferralTrackingHistory.objects.create(
                referral=referral,
                status="Request Completed",
                location=instance.referral.to_laboratory,
            )

            referral.referral_status = "Request Completed"
            referral.save()

        # Wrap the sample and sample_test updates in a transaction
        if sample_tests_data is not None:

            with transaction.atomic():
                # Update existing samples or create new ones
                for sample_test in sample_tests_data:

                    # _, created =
                    SampleTest.objects.update_or_create(
                        id=sample_test.get("test_id"),  # Find by ID if it exists
                        sample=instance,  # Always associate it with the current referral
                        defaults={
                            "result": sample_test.get("result"),
                            "status": "Completed",
                            'date_completed': timezone.now()
                        },
                    )

        return instance

    def to_representation(self, instance):

        data = super().to_representation(instance)
        data["referral"] = str(instance.referral)
        data["sample_type"] = SampleTypeSerializer(instance.sample_type).data
        data["sample_tests_data"] = SampleTestSerializer(
            instance.sample_tests.all(), many=True
        ).data
        data["rejection_reason"] = instance.get_rejection_reason()

        return data


class ReferralSerializer(serializers.ModelSerializer):
    to_laboratory = serializers.PrimaryKeyRelatedField(
        queryset=Facility.objects.filter(
            Q(branch__isnull=False) | Q(hospitallab__isnull=False)
        ),
        required=True,
    )
    laboratory_contact = serializers.CharField(read_only=True)
    clinical_history = serializers.CharField(required=False, allow_null=True, allow_blank=True)
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
            "referral_id",
            "referring_facility",
            "facility_type",
            "laboratory_contact",
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
            "samples",
        )

    def validate(self, data):
        # Check if referring_facility and to_laboratory are the same
        if data.get("referring_facility") == data.get("to_laboratory"):
            raise serializers.ValidationError(
                {
                    "to_laboratory": "The referring facility and the laboratory cannot be the same."
                }
            )
        return data

    def create(self, validated_data):
        samples_data = validated_data.pop("samples", [])
        with transaction.atomic():
            # Create Referral instance
            # print(validated_data)
            referral = Referral.objects.create(**validated_data)

            # Create Samples and associated SampleTests in bulk
            for sample_data in samples_data:
                sample_tests_data = sample_data.pop("sample_tests", [])
                sample = Sample.objects.create(referral=referral, **sample_data)
                SampleTest.objects.bulk_create([
                    SampleTest(sample=sample, test_id=test_id) for test_id in sample_tests_data
                ])

        return referral

    def update(self, instance, validated_data):
        samples_data = validated_data.pop("samples", None)

        # Update the instance with validated_data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        # Wrap the sample and sample_test updates in a transaction
        if samples_data is not None:
            with transaction.atomic():
                # Update existing samples or create new ones
                for sample_data in samples_data:
                    sample, _ = Sample.objects.update_or_create(
                        id=sample_data.get("id"),  # Find by ID if it exists
                        referral=instance,  # Always associate it with the current referral
                        defaults={
                            "sample_type": sample_data.get("sample_type"),
                            "sample_status": sample_data.get("sample_status"),
                            "rejection_reason": sample_data.get("rejection_reason"),
                        },
                    )

                    # Now update the sample tests for the sample
                    if sample_data["sample_tests"] is not None:
                        for sample_test_data in sample_data["sample_tests"]:
                            SampleTest.objects.update_or_create(
                                sample=sample,  # Always associate with the current sample
                                test_id=sample_test_data.get(
                                    "test_id"
                                ),  # Use test ID to match
                                defaults={
                                    "result": sample_test_data.get("result"),
                                    "status": "Completed",
                                    "date_completed": timezone.now(),
                                },
                            )

        return instance

    def to_representation(self, instance):

        data = super().to_representation(instance)

        data["referring_facility"] = str(instance.referring_facility)
        data["laboratory_contact"] = instance.to_laboratory.phone
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


class ReferralTrackDataSerializer(serializers.ModelSerializer):
    samples = SampleSerializer(many=True, required=False)

    class Meta:
        model = Referral

        fields = (
            "id",
            "referring_facility",
            "date_referred",
            "samples",
        )


class SampleTrackingSerializer(serializers.ModelSerializer):

    sample = serializers.PrimaryKeyRelatedField(
        queryset=Sample.objects.all(), required=False, write_only=True
    )
    sample_data = serializers.SerializerMethodField(read_only=True)

    class Meta:

        model = SampleTrackingHistory

        fields = (
            "id",
            "sample",
            "status",
            "updated_at",
            "sample_data",
        )

    def get_sample_data(self, obj):
        # Serialize the related Sample object
        if obj.sample:  # Ensure sample exists
            return SampleSerializer(obj.sample).data
        return None


class ReferralTrackingSerializer(serializers.ModelSerializer):

    referral = serializers.PrimaryKeyRelatedField(
        queryset=Referral.objects.all(), required=False, write_only=True
    )
    location = serializers.CharField(required=False)
    referral_data = serializers.SerializerMethodField(read_only=True)

    class Meta:

        model = ReferralTrackingHistory
        fields = ("id", "referral", "status", "location", "updated_at", "referral_data")

    def get_referral_data(self, obj):
        # Serialize the related referral object
        if obj.referral:  # Ensure referral exists
            return ReferralTrackDataSerializer(obj.referral).data
        return None
