from rest_framework import serializers
from .paginators import QueryPagination
from .models import (
		Laboratory, 
		Test, Branch, 
		LaboratorySample, 
		BranchManagerInvitation
	)
from .results import TestResult
from user.serializers import UserCreationSerializer
from user.models import Client



class LaboratorySerializer(serializers.ModelSerializer):
	logo = serializers.ImageField(required=False)
	created_by = serializers.PrimaryKeyRelatedField(read_only=True)

	class Meta:

		model = Laboratory

		fields = (
			'id',
			'created_by',
			'laboratory_name', 
			'herfra_id', 
			'main_phone', 
			'main_email', 
			'website', 
			'description',
			'logo', 
			'date_modified', 
			'date_added'
		)

	def to_representation(self, instance):

		data = super().to_representation(instance)
		data['created_by'] = instance.created_by.full_name
		
		return data


class BranchSerializer(serializers.ModelSerializer):
	laboratory = serializers.PrimaryKeyRelatedField(read_only=True)

	class Meta:

		model = Branch

		fields = (
			'id',
			'branch_manager', 
			'laboratory', 
			'branch_name', 
			'branch_phone', 
			'branch_email', 
			'location', 
			'digital_address', 
			'region', 
			'date_modified', 
			'date_added'
		)

	def to_representation(self, instance):

		data = super().to_representation(instance)
		data['branch_manager'] = instance.branch_manager.full_name
		data['laboratory'] = instance.laboratory.laboratory_name
		data['branch_name'] = instance.__str__()

		return data


class TestSerializer(serializers.ModelSerializer):

	branch = serializers.PrimaryKeyRelatedField(many=True, queryset=Branch.objects.all(), required=True)
	#branch = serializers.ListField(child=serializers.CharField())

	class Meta:

		model = Test
		fields = (
			'id',
			'test_code',
			'name',
			'turn_around_time',
			'price',
			'patient_preparation',
			'branch',
			'date_modified',
			'date_added'
		)

		pagination_class = QueryPagination

	def to_representation(self, instance):

		data = super().to_representation(instance)
		data['branch'] = [branch.branch_name for branch in instance.branch.all()]
		data['name'] = instance.__str__()

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
		data['laboratory'] = instance.laboratory.laboratory_name

		return data


class LaboratorySampleSerializer(serializers.ModelSerializer):

	attachment = serializers.FileField(required=False)
	send_by = serializers.PrimaryKeyRelatedField(read_only=True)
	tests = serializers.PrimaryKeyRelatedField(many=True, queryset=Test.objects.all())

	class Meta:

		model = LaboratorySample

		fields = (
			'id', 
			'send_by', 
			'from_lab', 
			'name_of_patient', 
			'patient_age', 
			'patient_sex',
			'delivery', 
			'is_paid', 
			'is_received_by_delivery', 
			'is_delivered_to_lab', 
			'is_access_by_lab', 
			'sample_type', 
			'to_lab', 
			'tests', 
			'brief_description', 
			'attachment', 
			'date_modified', 
			'date_added'
		)
		pagination_class = QueryPagination

	def to_representation(self, instance):

		data = super().to_representation(instance)
		data['tests'] = [test.name for test in instance.tests.all()]
		data['send_by'] = instance.send_by.full_name
		data['to_lab'] = instance.to_lab.branch_name
		data['from_lab'] = instance.from_lab.branch_name

		if data['delivery']:
			
			data['delivery'] = instance.delivery.name

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