from rest_framework import serializers
from sample.models import Sample, Notification, SampleTrackingHistory
from labs.models import Test
from modelmixins.models import Facility




class SampleSerializer(serializers.ModelSerializer):

	tests = serializers.PrimaryKeyRelatedField(many=True, queryset=Test.objects.all(), required=True)
	attachment = serializers.FileField(required=False)
	referring_facility = serializers.PrimaryKeyRelatedField(
		queryset=Facility.objects.all(),
		required=False
	)
	to_laboratory = serializers.PrimaryKeyRelatedField(queryset=Facility.objects.all(), required=False)
	sender_full_name = serializers.CharField(required=False)
	sender_phone = serializers.CharField(required=False)
	sender_email = serializers.CharField(required=False)
	facility_type = serializers.CharField(required=False)
	sample_status = serializers.CharField(required=False)

	class Meta:

		model = Sample

		fields = (
			'id',
			'patient_name',
			'patient_age',
			'patient_sex',
			'referring_facility',
			'facility_type',
			'to_laboratory',
			'sender_full_name',
			'sender_phone',
			'sender_email',
			'tests',
			'clinical_history',
			'attachment',
			'sample_status',
			'delivery',
			'priority',
			'date_modified',
			'date_created'
		)

	def to_representation(self, instance):

		data = super().to_representation(instance)

		data['tests'] = [test.name for test in instance.tests.all()]
		data['referring_facility'] = str(instance.to_laboratory)
		
		
		data['delivery'] = instance.delivery.name if instance.delivery else None
		data['to_laboratory'] = str(instance.to_laboratory)

		return data


class NotificationSerializer(serializers.ModelSerializer):

	branch = serializers.PrimaryKeyRelatedField(queryset=Test.objects.all(), required=False)
	message = serializers.CharField(required=False)
	is_read = serializers.BooleanField(default=False)
	is_hidden = serializers.BooleanField(default=False)

	class Meta:

		model = Notification

		fields = (
			'id', 
			'branch', 
			'message',
			'is_read',
			'is_hidden',
			'date_created',
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
