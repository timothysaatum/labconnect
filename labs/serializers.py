from rest_framework import serializers # type: ignore
from .models import (
		Laboratory, 
		Test, Branch,  
		BranchManagerInvitation,
		BranchTest
	)
from modelmixins.models import SampleType, FacilityWorkingHours
from modelmixins.serializers import SampleTypeSerializer


class LaboratorySerializer(serializers.ModelSerializer):

	logo = serializers.URLField(required=False)
	website = serializers.URLField(required=False)
	account_number = serializers.CharField(write_only=True, required=False)
	bank_name = serializers.CharField(write_only=True, required=False)
	bank_code = serializers.CharField(write_only=True, required=False)

	class Meta:

		model = Laboratory

		fields = (
			'id',
			'name',
			"account_number",
            "bank_name",
            "bank_code",
			'main_phone', 
			'main_email',
			'account', 
			'website',
			'description',
			'logo', 
			'date_modified', 
			'date_added'
		)


class BranchSerializer(serializers.ModelSerializer):

	account = serializers.CharField(required=False)
	laboratory = serializers.PrimaryKeyRelatedField(read_only=True)
	manager_id = serializers.CharField(read_only=True)
	branch_name = serializers.CharField(required=False, allow_null=True, allow_blank=True)
	name = serializers.CharField(read_only=True)
	account_number = serializers.CharField(write_only=True, required=False)
	bank_name = serializers.CharField(write_only=True, required=False)
	bank_code = serializers.CharField(write_only=True, required=False)

	class Meta:

		model = Branch

		fields = (
			'id',
			'branch_name',
			"account_number",
            "bank_name",
            "bank_code",
			'accreditation_number',
			'level',
			'branch_manager',
			'manager_id',
			'laboratory',
			'name',
			'phone',
			'email',
			'account',
			'town',
			'digital_address',
			'region',
			'date_added',
			'date_modified'
		)
		

	def to_representation(self, instance):

		data = super().to_representation(instance)
		data['branch_manager'] = instance.branch_manager.full_name if instance.branch_manager else instance.laboratory.created_by.full_name
		data['manager_id'] = instance.branch_manager.id if instance.branch_manager else instance.laboratory.created_by.id
		data['name'] = instance.branch_name if instance.branch_name else f'{instance.laboratory.name} - {instance.town}'

		return data
	
	def create(self, validated_data):
		working_hours_data = validated_data.pop('working_hours', None)
		branch = super().create(validated_data)

		if working_hours_data:
			FacilityWorkingHours.objects.create(branch=branch, **working_hours_data)

		return branch

	def update(self, instance, validated_data):
		
		working_hours_data = validated_data.pop('working_hours', None)
		
		instance = super().update(instance, validated_data)

		if working_hours_data:
			FacilityWorkingHours.objects.update_or_create(branch=instance, defaults=working_hours_data)

		return instance


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
			'test_status',
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
			'test_status': obj.test_status,
			'turn_around_time': obj.turn_around_time,
		}

		if branch_id:

			try:

				branch_test = BranchTest.objects.get(test=obj, branch_id=branch_id)
				data['price'] = branch_test.price or obj.price
				data['discount_price'] = branch_test.discount_price or obj.discount_price
				data['discount_percent'] = branch_test.discount_percent or obj.discount_percent
				data['test_status'] = branch_test.test_status or obj.test_status
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
			'test_status', 
			'discount_percent',
			'turn_around_time'
		]



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