from rest_framework import serializers
from sample.models import Sample, Notification
from labs.paginators import QueryPagination
from labs.models import Test, SampleType




class TestDataSerializer(serializers.Serializer):
	test = serializers.UUIDField()
	sample_type = serializers.IntegerField()


class SampleSerializer(serializers.ModelSerializer):

	attachment = serializers.FileField(required=False)
	referring_facility = serializers.PrimaryKeyRelatedField(read_only=True)
	sample_types = serializers.PrimaryKeyRelatedField(
		queryset=SampleType.objects.all(), 
		many=True
	)
	tests = serializers.PrimaryKeyRelatedField(
		queryset=Test.objects.all(), 
		many=True
	)
	test_data = serializers.DictField(
		child=serializers.ListField(),
		write_only=True
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
			'test_data',
			'is_rejected',
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

		extra_kwargs = {
			'sample_type': {'read_only': True},
			'tests': {'read_only': True}
		}

	# pagination_class = QueryPagination

	def to_representation(self, instance):

		data = super().to_representation(instance)
		data['tests'] = [test.name for test in instance.tests.all()]
		data['referring_facility'] = instance.referring_facility.name
		# data['sample_type'] = instance.sample_type.sample_name
		data['to_laboratory'] = instance.to_laboratory.name

		if data['delivery']:

			data['delivery'] = instance.delivery.name

		return data

	def create(self, validated_data):
		test_data = validated_data.pop('test_data')
		samples = []

		for sample_data in test_data:
			test_ids = []
			sample_ids = []

			for key, val in sample_data:

				if key.startswith('test'):
					test_ids.append(val)
				elif key.startswith('sample'):
					sample_ids.append(val)
					
			sample = Sample.objects.create(**validated_data)
			sample.tests.add(*test_ids)
			samples.sample_types.add(*sample_ids)

		return samples


class NotificatinSerializer(serializers.ModelSerializer):

	user = serializers.StringRelatedField(source='__str__')
	message = serializers.CharField()

	is_read = serializers.BooleanField(default=False)

	class Meta:

		model = Notification

		fields = (
			'id', 
			'user', 
			'message',
			'is_read',
			'date_created',
			'date_modified'
		)
