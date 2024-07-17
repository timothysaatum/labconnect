from rest_framework import serializers
from .paginators import QueryPagination
from .models import (
		Laboratory, 
		Test, Branch,  
		BranchManagerInvitation,
		SampleType,
		BranchTest
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
		if data['branch_manager']:
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
	sample_type = serializers.PrimaryKeyRelatedField(many=True, queryset=SampleType.objects.all(), required=True)
	discount_price = serializers.DecimalField(decimal_places=2, max_digits=10, required=False)


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
			'is_deactivated',
			'date_modified',
			'date_added'
		)

		# pagination_class = QueryPagination
	def get_branch_specific_data(self, obj):
		branch_id = self.context.get('pk')
		data = {
			'price': obj.price,
			'discount_price': obj.discount_price,
			'discount_percent': obj.discount_percent,
			'is_deactivated': obj.is_deactivated,
			'turn_around_time': obj.turn_around_time,
		}

		if branch_id:
			try:
				branch_test = BranchTest.objects.get(test=obj, branch_id=branch_id)
				data['price'] = branch_test.price or obj.price
				data['discount_price'] = branch_test.discount_price or obj.discount_price
				data['discount_percent'] = branch_test.discount_percent or obj.discount_percent
				data['is_deactivated'] = branch_test.is_deactivated or obj.is_deactivated
				data['turn_around_time'] = branch_test.turn_around_time or obj.turn_around_time
			except BranchTest.DoesNotExist:
				raise('No such branch')
		return data

	def to_representation(self, instance):
		data = super().to_representation(instance)
		data['name'] = str(instance)
		branch_test_details = self.get_branch_specific_data(instance)
		data.update(branch_test_details)
		data['sample_type'] = SampleTypeSerializer(instance.sample_type.all(), many=True).data
		return data


class BranchTestSerializer(serializers.ModelSerializer):

	class Meta:
		model = BranchTest
		fields = [
			'price', 
			'discount_price', 
			'is_deactivated', 
			'discount_percent',
			'turn_around_time'
		]


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