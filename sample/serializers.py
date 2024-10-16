from rest_framework import serializers # type: ignore
from sample.models import (
      Sample, 
      Notification, 
      SampleTrackingHistory, 
      Referral,
      SampleTest
      )
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
    is_emmergency = serializers.BooleanField(default=False)
    result = serializers.URLField(required=False)


    class Meta:

        model = SampleTest

        fields = (
            "id",
            "sample",
            "test",
            "status",
            'result',
            "is_emmergency",
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
    sample_type = SampleTypeSerializer(required=False)
    rejection_reason = serializers.CharField(required=False)
    sample_status = serializers.CharField(required=False)
    sample_tests = SampleTestSerializer(many=True)

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
        )

    def create(self, validated_data):
        sample_tests_data = validated_data.pop('sample_tests')
        sample = Sample.objects.create(**validated_data)

        # Creating SampleTest entries
        for sample_test_data in sample_tests_data:
            SampleTest.objects.create(sample=sample, **sample_test_data)

        return sample

    def update(self, instance, validated_data):
        sample_tests_data = validated_data.pop("sample_tests")
        instance.patient_name = validated_data.get(
            "patient_name", instance.patient_name
        )
        instance.patient_age = validated_data.get("patient_age", instance.patient_age)
        instance.patient_sex = validated_data.get("patient_sex", instance.patient_sex)
        instance.clinical_history = validated_data.get(
            "clinical_history", instance.clinical_history
        )
        instance.requires_phlebotomist = validated_data.get(
            "requires_phlebotomist", instance.requires_phlebotomist
        )
        instance.sample_status = validated_data.get(
            "sample_status", instance.sample_status
        )
        instance.save()

        for sample_test_data in sample_tests_data:
            sample_test = SampleTest.objects.filter(
                sample=instance, test=sample_test_data["test"]
            ).first()
            if sample_test:
                sample_test.status = sample_test_data.get("status", sample_test.status)
                sample_test.rejection_reason = sample_test_data.get(
                    "rejection_reason", sample_test.rejection_reason
                )
                sample_test.save()
            else:
                SampleTest.objects.create(sample=instance, **sample_test_data)

        return instance

    def to_representation(self, instance):

        data = super().to_representation(instance)
        data["referral"] = str(instance.referral)
        data["sample_type"] = SampleTypeSerializer(
            SampleType.objects.filter(sample=instance), many=True
        ).data

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
    facility_type = serializers.CharField(read_only=True)

    class Meta:
        model = Referral

        fields = (
            "id",
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
            # sample_type = sample_data.pop("sample_type")
            sample = Sample.objects.create(referral=referral, **sample_data)

            # Creating SampleTest entries for each sample
            for sample_test_data in sample_tests_data:
                SampleTest.objects.create(sample=sample, **sample_test_data)

        return referral


    def update(self, instance, validated_data):
        samples_data = validated_data.pop("samples")
        instance.referring_facility = validated_data.get(
            "referring_facility", instance.referring_facility
        )
        instance.requires_phlebotomist = validated_data.get(
            "requires_phlebotomist", instance.requires_phlebotomist
        )
        instance.sender_full_name = validated_data.get(
            "sender_full_name", instance.sender_full_name
        )
        instance.sender_phone = validated_data.get(
            "sender_phone", instance.sender_phone
        )
        instance.sender_email = validated_data.get(
            "sender_email", instance.sender_email
        )
        instance.patient_name = validated_data.get(
            "patient_name", instance.patient_name
        )
        instance.patient_age = validated_data.get(
            "patient_age", instance.patient_age
        )
        instance.clinical_history = validated_data.get(
            "clinical_history", instance.clinical_history
        )
        instance.referral_status = validated_data.get(
            "referral_status", instance.referral_status
        )
        instance.attachment = validated_data.get(
            "attachment", instance.attachment
        )
        instance.to_laboratory = validated_data.get(
            "to_laboratory", instance.to_laboratory
        )
        instance.save()

        for sample_data in samples_data:
            sample = Sample.objects.filter(
                referral=instance, id=sample_data["id"]
            ).first()
            if sample:
                sample.sample_type = sample_data.get(
                    "sample_type", sample.sample_type
                )
                sample.sample_status = sample_data.get(
                    "sample_status", sample.sample_status
                )
                sample.rejection_reason = sample_data.get(
                    "rejection_reason", sample.rejection_reason
                )
                sample.save(referral=instance)

                # Update sample tests
                for sample_test_data in sample_data["sample_tests"]:
                    sample_test = SampleTest.objects.filter(
                        sample=sample, test=sample_test_data["test"]
                    ).first()
                    if sample_test:
                        sample_test.status = sample_test_data.get(
                            "status", sample_test.status
                        )
                        sample_test.sample_tests = sample_test_data.get(
                            "sample_tests", sample_test.sample_tests
                        )
                        sample_test.sample_type = sample_test_data.get(
                            "sample_type", sample_test.sample_type
                        )
                        sample_test.rejection_reason = sample_test_data.get(
                            "rejection_reason", sample_test.rejection_reason
                        )
                        sample_test.save()
            else:
                # Create new sample and associated tests
                new_sample = Sample.objects.create(referral=instance, **sample_data)
                for sample_test_data in sample_data["sample_tests"]:
                    SampleTest.objects.create(sample=new_sample, **sample_test_data)

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
