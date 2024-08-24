from rest_framework import serializers
from sample.models import Sample, Notification
from labs.models import Test
from hospital.models import Facility



class SampleSerializer(serializers.ModelSerializer):

	tests = serializers.PrimaryKeyRelatedField(many=True, queryset=Test.objects.all(), required=True)
	attachment = serializers.FileField(required=False)
	referring_facility = serializers.PrimaryKeyRelatedField(
		queryset=Facility.objects.all(),
		required=False
	)

	sender_full_name = serializers.CharField(required=False)
	sender_phone = serializers.CharField(required=False)
	sender_email = serializers.CharField(required=False)
	facility_type = serializers.CharField(required=False)

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
			'is_rejected',
			'tests',
			'clinical_history',
			'attachment',
			'sample_status',
			'delivery',
			'priority',
			'is_marked_sent',
			'date_modified',
			'date_created'
		)

	def to_representation(self, instance):

		data = super().to_representation(instance)
		data['tests'] = [test.name for test in instance.tests.all()]
		data['referring_facility'] = (instance.referring_facility.hospital.name
								if instance.facility_type == 'Hospital' else f'{instance.referring_facility.branch.town} - {instance.referring_facility.branch.laboratory.name}')
		
		data['to_laboratory'] = instance.to_laboratory.laboratory.name if instance.to_laboratory else None
		data['delivery'] = instance.delivery.name if instance.delivery else None

		return data


class NotificationSerializer(serializers.ModelSerializer):

	branch = serializers.PrimaryKeyRelatedField(queryset=Test.objects.all(), required=True)
	message = serializers.CharField()

	is_read = serializers.BooleanField(default=False)

	class Meta:

		model = Notification

		fields = (
			'id', 
			'branch', 
			'message',
			'is_read',
			'date_created',
			'date_modified'
		)


class CountObjectsSerializer(serializers.Serializer):

	samples_received = serializers.IntegerField(read_only=True)
	samples_sent = serializers.IntegerField(read_only=True)
	samples_rejected = serializers.IntegerField(read_only=True)
	samples_processed = serializers.IntegerField(read_only=True)

	class Meta:

		fields = (
			'samples_received',
			'samples_sent',
			'samples_rejected',
			'samples_processed'
		)
