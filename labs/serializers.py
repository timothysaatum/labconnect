from rest_framework import serializers
from .models import (
		Laboratory,
		Test, Branch,
		BranchManagerInvitation,
		BranchTest
	)
from django.core.validators import RegexValidator
from modelmixins.models import SampleType, FacilityWorkingHours
from modelmixins.serializers import SampleTypeSerializer, FacilityWorkingHoursSerializer
from django.db import transaction


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
# 			'account',
			'website',
			'description',
			'logo',
			'date_modified',
			'date_added'
		)


# class BranchSerializer(serializers.ModelSerializer):
# 	laboratory = serializers.PrimaryKeyRelatedField(read_only=True)
# 	manager_id = serializers.CharField(read_only=True)
# 	branch_name = serializers.CharField(required=False, allow_null=True, allow_blank=True)
# 	name = serializers.CharField(read_only=True)
# 	digital_address = serializers.CharField(validators=[
#         RegexValidator(
#             regex=r"^[A-Z]{2}-\d{3,4}-\d{4,5}$",
#             message="Format must be AA-XXXX-XXXX (e.g., XL-0745-0849)"
#         )
#     ])
# 	account_number = serializers.CharField(write_only=True, required=False)
# 	bank_name = serializers.CharField(write_only=True, required=False)
# 	bank_code = serializers.CharField(write_only=True, required=False)
# 	gps_coordinates = serializers.CharField(read_only=True)
# 	working_hours = FacilityWorkingHoursSerializer(many=True, required=False)

# 	class Meta:
# 		model = Branch
# 		fields = (
#             'id',
#             'branch_name',
#             "account_number",
#             "bank_name",
#             "bank_code",
#             'accreditation_number',
#             'level',
#             'branch_manager',
#             'manager_id',
#             'laboratory',
#             'name',
#             'phone',
#             'email',
#             'town',
#             'digital_address',
#             'gps_coordinates',
#             'region',
#             "working_hours",
#             'date_added',
#             'date_modified'
#         )
		
# 	def validate_account_number(self, value):
# 		"""
#     	If the number starts with +233 or 233, convert it to start with 0.
#     	Otherwise, leave it unchanged (it could be a bank account).
#     	Also removes all whitespace characters.
#     	"""
# 		value = value.strip().replace(" ", "").lstrip("+")  # Remove whitespace and leading '+'
		
# 		if value.startswith("233"):
# 			value = "0" + value[3:]  # Convert 233XXXXXXX to 0XXXXXXXXX
	
# 		return value


# 	def to_representation(self, instance):
# 		data = super().to_representation(instance)
# 		data['branch_manager'] = instance.branch_manager.full_name if instance.branch_manager else instance.laboratory.created_by.full_name
# 		data['manager_id'] = instance.branch_manager.id if instance.branch_manager else instance.laboratory.created_by.id
# 		data['name'] = instance.branch_name if instance.branch_name else f'{instance.laboratory.name} - {instance.town}'
# 		return data

# 	def create(self, validated_data):
# 		if "account_number" in validated_data:
# 			validated_data["account_number"] = self.validate_account_number(validated_data["account_number"])
# 		print(validated_data)
# 		working_hours_data = validated_data.pop('working_hours', None)
# 		print(validated_data)
# 		branch = super().create(validated_data)

# 		if working_hours_data:
# 			FacilityWorkingHours.objects.bulk_create([
#                 FacilityWorkingHours(
#                     facility=branch,
#                     **working_hour
#                 ) for working_hour in working_hours_data
#             ])

# 		return branch

# 	def update(self, instance, validated_data):

# 		# Extract working hours data
# 		working_hours_data = validated_data.pop('working_hours', None)
# 		instance = super().update(instance, validated_data)

		

# 		if "digital_address" in validated_data and validated_data["digital_address"]:
# 			print("Running")
# 			get_gps_coords(validated_data["digital_address"])

# 		if "account_number" in validated_data and validated_data["account_number"]:
# 			print("Running")
# 			create_customer_subaccount(instance)

		
# 		if working_hours_data:
# 			# Fetch existing records in bulk for efficient lookup
# 			existing_records_dict = {
#                 record.day: record for record in FacilityWorkingHours.objects.filter(facility=instance)
#             }

# 			new_records = []
# 			records_to_update = []

# 			for working_hour in working_hours_data:
# 				day = working_hour["day"]
# 				start_time = working_hour["start_time"]
# 				end_time = working_hour["end_time"]

# 				if day in existing_records_dict:
# 					# Update existing record
# 					existing_record = existing_records_dict[day]
# 					existing_record.start_time = start_time
# 					existing_record.end_time = end_time
# 					records_to_update.append(existing_record)

# 				else:
# 					# Create new record
# 					new_records.append(FacilityWorkingHours(
#                         facility=instance,
#                         day=day,
#                         start_time=start_time,
#                         end_time=end_time
#                     ))
# 			# Use transaction for atomicity and execute bulk operations efficiently
# 			with transaction.atomic():
# 				FacilityWorkingHours.objects.bulk_create(new_records)
# 				FacilityWorkingHours.objects.bulk_update(records_to_update, ["start_time", "end_time"])

# 		return instance

class BranchSerializer(serializers.ModelSerializer):
    laboratory = serializers.PrimaryKeyRelatedField(read_only=True)
    manager_id = serializers.CharField(read_only=True)
    branch_name = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    name = serializers.CharField(read_only=True)
    digital_address = serializers.CharField(validators=[
        RegexValidator(
            regex=r"^[A-Z]{2}-\d{3,4}-\d{4,5}$",
            message="Format must be AA-XXXX-XXXX (e.g., XL-0745-0849)"
        )
    ])
    account_number = serializers.CharField(write_only=True, required=False)
    bank_name = serializers.CharField(write_only=True, required=False)
    bank_code = serializers.CharField(write_only=True, required=False)
    gps_coordinates = serializers.CharField(read_only=True)
    working_hours = FacilityWorkingHoursSerializer(many=True, required=False)

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
            'town',
            'digital_address',
            'gps_coordinates',
            'region',
            "working_hours",
            'date_added',
            'date_modified'
        )
    
    def validate_account_number(self, value):
        """
        If the number starts with +233 or 233, convert it to start with 0.
        Otherwise, leave it unchanged (it could be a bank account).
        Also removes all whitespace characters.
        """
        value = value.strip().replace(" ", "").lstrip("+")  # Remove whitespace and leading '+'
        
        if value.startswith("233"):
            value = "0" + value[3:]  # Convert 233XXXXXXX to 0XXXXXXXXX
        
        return value

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['branch_manager'] = instance.branch_manager.full_name if instance.branch_manager else instance.laboratory.created_by.full_name
        data['manager_id'] = instance.branch_manager.id if instance.branch_manager else instance.laboratory.created_by.id
        data['name'] = instance.branch_name if instance.branch_name else f'{instance.laboratory.name} - {instance.town}'
        return data

    def create(self, validated_data):
        if "account_number" in validated_data:
            validated_data["account_number"] = self.validate_account_number(validated_data["account_number"])
        
        working_hours_data = validated_data.pop('working_hours', None)
        branch = super().create(validated_data)

        if working_hours_data:
            FacilityWorkingHours.objects.bulk_create([
                FacilityWorkingHours(
                    facility=branch,
                    **working_hour
                ) for working_hour in working_hours_data
            ])

        return branch

    def update(self, instance, validated_data):
        # Extract working hours data
        working_hours_data = validated_data.pop('working_hours', None)
        instance = super().update(instance, validated_data)

        if working_hours_data is not None:
            # Fetch all existing records for this facility
            existing_records = FacilityWorkingHours.objects.filter(facility=instance)
            existing_records_dict = {record.day: record for record in existing_records}
            
            provided_days = {wh["day"] for wh in working_hours_data}
            
            # Identify records to delete (days in DB but not in provided data)
            records_to_delete = [record for day, record in existing_records_dict.items() if day not in provided_days]
            
            # Prepare lists for bulk operations
            new_records = []
            records_to_update = []

            for working_hour in working_hours_data:
                day = working_hour["day"]
                start_time = working_hour["start_time"]
                end_time = working_hour["end_time"]

                if day in existing_records_dict:
                    # Update existing record (only if time has changed)
                    existing_record = existing_records_dict[day]
                    if existing_record.start_time != start_time or existing_record.end_time != end_time:
                        existing_record.start_time = start_time
                        existing_record.end_time = end_time
                        records_to_update.append(existing_record)
                else:
                    # Create new record (this was misaligned before)
                    new_records.append(FacilityWorkingHours(
                        facility=instance,
                        day=day,
                        start_time=start_time,
                        end_time=end_time
                    ))

            # Execute bulk operations inside a transaction for efficiency
            with transaction.atomic():
                if new_records:
                    FacilityWorkingHours.objects.bulk_create(new_records)

                if records_to_update:
                    FacilityWorkingHours.objects.bulk_update(records_to_update, ["start_time", "end_time"])

                if records_to_delete:
                    FacilityWorkingHours.objects.filter(id__in=[r.id for r in records_to_delete]).delete()

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
