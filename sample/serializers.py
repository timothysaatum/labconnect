from rest_framework import serializers
from sample.models import Sample, Notification
from labs.paginators import QueryPagination
from labs.models import Test, SampleType
from user.models import Client
import uuid

class UUIDField(serializers.UUIDField):
	def to_internal_value(self, data):
		return super().to_internal_value(str(data))

class TestDataSerializer(serializers.Serializer):
	test = UUIDField()
	sample_type = serializers.IntegerField()

class SampleSerializer(serializers.ModelSerializer):

	attachment = serializers.FileField(required=False)
	referring_facility = serializers.PrimaryKeyRelatedField(read_only=True)
	sample_type = serializers.PrimaryKeyRelatedField(read_only=True)
	tests = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
	test_data = serializers.ListField(child=TestDataSerializer(), write_only=True)
	sender_full_name = serializers.CharField(required=False)
	sender_phone = serializers.CharField(required=False)
	sender_email = serializers.CharField(required=False)
	facility_type = serializers.CharField(required=False)

	def validate_test_data(self, value):
		for item in value:
			if not isinstance(item.get('test'), uuid.UUID):
				try:
					item['test'] = uuid.UUID(item['test'])
				except ValueError:
					raise serializers.ValidationError('invalid UUID for "test" field')
			if not isinstance(item.get('sample_type'), int):
				raise serializers.ValidationError('Invalid integer for "sample_type" field')
		return value

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
			'test_data',
			'sample_type',  
			'tests', 
			'clinical_history', 
			'attachment',
			'sample_status',
			'payment_mode',
			'payment_status',
			'delivery',
			'priority',
			'date_modified', 
			'date_created'
		)

	pagination_class = QueryPagination

	def to_representation(self, instance):

		data = super().to_representation(instance)
		data['tests'] = [test.name for test in instance.tests.all()]
		data['referring_facility'] = instance.referring_facility.name
		data['sample_type'] = instance.sample_type.sample_name
		data['to_laboratory'] = instance.to_laboratory.name

		if data['delivery']:

			data['delivery'] = instance.delivery.name

		return data


class NotificatinSerializer(serializers.ModelSerializer):

	user = serializers.StringRelatedField(source='__str__')
	sample = serializers.PrimaryKeyRelatedField(queryset=Sample.objects.all())
	status = serializers.CharField(required=False)
	is_read = serializers.BooleanField(default=False)

	class Meta:

		model = Notification

		fields = (
			'id', 
			'user', 
			'sample',
			'status',
			'is_read',
			'date_created',
			'date_modified'
		)
