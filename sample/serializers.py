from rest_framework import serializers # type: ignore
from sample.models import Sample, Notification, SampleTrackingHistory, Referral
from labs.models import Test
from modelmixins.models import Facility, SampleType
from modelmixins.serializers import SampleTypeSerializer


class SampleSerializer(serializers.ModelSerializer):

    tests = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Test.objects.all(), required=True
    )
    attachment = serializers.URLField(required=False)
    referral = serializers.PrimaryKeyRelatedField(
        queryset=Referral.objects.all(), required=False
    )
    sample_type = serializers.PrimaryKeyRelatedField(
        queryset=SampleType.objects.all(), required=False
    )
    is_emmergency = serializers.BooleanField(default=False)
    rejection_reason = serializers.CharField(required=False)
    sample_status = serializers.CharField(required=False)

    class Meta:

        model = Sample

        fields = (
            "id",
            "sample_type",
            "tests",
            "referral",
            "attachment",
            "sample_status",
            "is_emmergency",
            "rejection_reason",
            "date_modified",
            "date_added",
        )

    def to_representation(self, instance):

        data = super().to_representation(instance)

        data["tests"] = [test.name for test in instance.tests.all()]

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
    samples = serializers.PrimaryKeyRelatedField(
        required=False, queryset=Sample.objects.all(), many=True
    )
    facility_type = serializers.CharField(read_only=True)

    class Meta:
        model = Referral
        fields = (
            "id",
            "referring_facility",
            "samples",
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
            "date_referred",
        )

    def to_representation(self, instance):
        print("Hello")
        data = super().to_representation(instance)
        print('Hello')
        print(Sample.objects.filter(referral=instance), 'hi')
        data["samples"] = SampleSerializer(
                Sample.objects.filter(referral=instance), many=True
            ).data
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
