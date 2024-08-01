from rest_framework import serializers
from sample.models import Sample, Notification
from labs.paginators import QueryPagination
from labs.models import Test, SampleType
import json



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
	# test_data = serializers.ListField(
    #     child=TestDataSerializer(),
    #     write_only=True
    # )
	test_data = serializers.CharField(write_only=True)
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
			'sample_types',
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

		# extra_kwargs = {
		# 	'sample_type': {'read_only': True},
		# 	'tests': {'read_only': True}
		# }

	# pagination_class = QueryPagination

	def to_representation(self, instance):

		data = super().to_representation(instance)
		print(data)
		data['tests'] = [test.name for test in instance.tests.all()]
		data['referring_facility'] = instance.referring_facility.name if instance.referring_facility else None
		data['sample_types'] = [sample_type.sample_name for sample_type in instance.sample_types.all()]
		data['to_laboratory'] = instance.to_laboratory.name if instance.to_laboratory else None
		data['delivery'] = instance.delivery.name if instance.delivery else None

		return data

	# def create(self, validated_data):
		
	# 	test_data_list = validated_data.pop('test_data', [])
	# 	print(json.loads(test_data_list))
	# 	samples = []
	# 	# print(test_data_list)
	# 	# for item in test_data_list:
	# 	# 	test_id = item.get('test')
	# 	# 	sample_type_id = item.get('sample_type')

    #     #     # Assuming you want to create a Sample object for each test and sample_type pair
	# 	# 	sample = Sample.objects.create(**validated_data)
	# 	# 	if test_id:
	# 	# 		sample.tests.add(test_id)
	# 	# 	if sample_type_id:
	# 	# 		sample.sample_types.add(sample_type_id)
	# 		# samples.append(sample)

	# 	return samples

	def create(self, validated_data):
    	
		test_data_json = validated_data.pop('test_data', '[]')
		test_data_list = json.loads(test_data_json)
		
		tests_data = validated_data.pop('tests', [])
		sample_types_data = validated_data.pop('sample_types', [])
    
    	
		sample = Sample.objects.create(**validated_data)
    
		
		test_ids = []
		sample_type_ids = []

		for item in test_data_list:
			test_id = item.get('test')
			sample_type_id = item.get('sample_type')
        
			if test_id:
				test_ids.append(test_id)
			if sample_type_id:
				sample_type_ids.append(sample_type_id)
    
		print(test_ids, sample_type_ids)
		if test_ids:
			sample.tests.add(*test_ids)
		if sample_type_ids:
			sample.sample_types.add(*sample_type_ids)

		if tests_data:
			sample.tests.set(tests_data)
		if sample_types_data:
			sample.sample_types.set(sample_types_data)
    
		return sample



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