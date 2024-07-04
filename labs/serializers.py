from rest_framework import serializers
from .paginators import QueryPagination
from .models import (
		Laboratory, 
		Test, Branch,  
		BranchManagerInvitation,
		SampleType
	)
from .results import TestResult



class LaboratorySerializer(serializers.ModelSerializer):
	logo = serializers.ImageField(required=False)
	

	class Meta:

		model = Laboratory

		fields = (
			'id',
			'name', 
			'herfra_id', 
			'main_phone', 
			'main_email',
			'postal_address', 
			'website', 
			'description',
			'logo', 
			'date_modified', 
			'date_created'
		)


class BranchSerializer(serializers.ModelSerializer):
	laboratory = serializers.PrimaryKeyRelatedField(read_only=True)

	class Meta:

		model = Branch

		fields = (
			'id',
			'branch_manager',
			'laboratory', 
			'name',
			'phone',
			'email',
			'postal_address',
			'town',
			'digital_address',
			'region',
			'date_created'
		)

	def to_representation(self, instance):

		data = super().to_representation(instance)
		data['branch_manager'] = instance.branch_manager.full_name
		data['laboratory'] = instance.laboratory.name

		return data


class SampleTypeSerializer(serializers.ModelSerializer):

	class Meta:
		model = SampleType

		fields = (
			'id',
			'sample_name',
			'collection_procedure',
			'collection_time'
		)


class TestSerializer(serializers.ModelSerializer):

	branch = serializers.PrimaryKeyRelatedField(many=True, queryset=Branch.objects.all(), required=True)
	#branch = BranchSerializer(many=True, required=True)
	sample_type = serializers.PrimaryKeyRelatedField(many=True, queryset=SampleType.objects.all(), required=True)
	# sample_type = SampleTypeSerializer(many=True)

	class Meta:

		model = Test
		fields = (
			'id',
			'test_code',
			'name',
			'turn_around_time',
			'price',
			'discount_price',
			'patient_preparation',
			'sample_type',
			'branch',
			'date_modified',
			'date_added'
		)

		pagination_class = QueryPagination

	# def create(self, validated_data):
	# 	branches_data = validated_data.pop('branch')
	# 	sample_types_data = validated_data.pop('sample_type', [])
		
	# 	test = Test.objects.create(**validated_data)
	# 	test.branch.set(branches_data)
		
	# 	for sample_type_data in sample_types_data:
	# 		sample_type, _ = SampleType.objects.get_or_create(**sample_type_data)
	# 		test.sample_type.add(sample_type)
	# 	return test

	# def update(self, instance, validated_data):
	# 	branches_data = validated_data.pop('branch', None)
	# 	sample_types_data = validated_data.pop('sample_type', None)
        
	# 	for attr, value in validated_data.items():
	# 		setattr(instance, attr, value)
        
	# 	if branches_data is not None:
	# 		instance.branch.set(branches_data)
        
	# 	if sample_types_data is not None:
	# 		instance.sample_type.clear()
	# 		for sample_type_data in sample_types_data:
	# 			sample_type, _ = SampleType.objects.get_or_create(**sample_type_data)
	# 			instance.sample_type.add(sample_type)
        
	# 	instance.save()
	# 	return instance

	def to_representation(self, instance):
		data = super().to_representation(instance)
		data['name'] = str(instance)
		data['sample_type'] = SampleTypeSerializer(instance.sample_type.all(), many=True).data
		return data


class TestResultSerializer(serializers.ModelSerializer):

	send_by = serializers.PrimaryKeyRelatedField(read_only=True)
	branch = serializers.PrimaryKeyRelatedField(read_only=True)
	hospital = serializers.PrimaryKeyRelatedField(read_only=True)
	test = serializers.PrimaryKeyRelatedField(read_only=True)
	sample = serializers.PrimaryKeyRelatedField(read_only=True)
	branch = serializers.StringRelatedField(source='__str__')

	class Meta:

		model = TestResult
		fields = (
			'id',
			'send_by', 
			'branch', 
			'hospital', 
			'test', 
			'result', 
			'sample',
			'comments', 
			'is_verified', 
			'is_received', 
			'date_modified', 
			'date_added'
		)

		pagination_class = QueryPagination

	def to_representation(self, instance):

		data = super().to_representation(instance)
		data['send_by'] = instance.send_by.full_name
		data['hospital'] = instance.hospital.name
		data['sample'] = instance.sample.sample_type
		data['test'] = instance.test.name
		data['laboratory'] = instance.laboratory.name

		return data



class BranchManagerInvitationSerializer(serializers.ModelSerializer):

	first_name = serializers.CharField(required=False, write_only=True)
	last_name = serializers.CharField(required=False, write_only=True)
	phone_number = serializers.CharField(required=False, write_only=True)
	sender = serializers.PrimaryKeyRelatedField(read_only=True)

	class Meta:

		model = BranchManagerInvitation

		fields = (

			'id',
			'first_name',
			'last_name',
			'phone_number',
			'invitation_code',
			'sender',
			'receiver_email',
			'branch',
			'used',

		)

	def create(self, validated_data):

		invitation = BranchManagerInvitation.objects.create(
				receiver_email=validated_data.get('receiver_email'),
				branch=validated_data.get('branch'),
				sender=validated_data.get('sender'),
			)

		return invitation