from rest_framework import serializers
from .models import Laboratory, Department, Test, Branch
from .results import TestResult



class LaboratorySerializer(serializers.ModelSerializer):
	logo = serializers.ImageField(required=False)

	class Meta:

		model = Laboratory
		fields = ('id' ,'laboratory_name', 'herfra_id', 
			'digital_address', 'main_phone', 'main_email', 'website', 
			'description', 'date_modified', 'date_added', 'logo')




class DepartmentSerializer(serializers.ModelSerializer):

	class Meta:

		model = Department
		fields = ('id' ,'department_name', 'heard_of_department', 'phone', 'email', 'date_modified', 'date_added')



class BranchSerializer(serializers.ModelSerializer):

	class Meta:

		model = Branch
		fields = ('id' ,'branch_manager', 'laboratory', 'branch_name', 'branch_phone', 
			'branch_email', 'location', 'digital_address', 'region', 'date_modified', 'date_added')


class TestSerializer(serializers.ModelSerializer):

	class Meta:

		model = Test
		fields = ('id' ,'department', 'name', 'price', 'discount_price', 'date_modified', 'date_added')




class TestResultSerializer(serializers.ModelSerializer):


	send_by = serializers.IntegerField(read_only=True)
	department = serializers.IntegerField(read_only=True)
	laboratory = serializers.IntegerField(read_only=True)
	hospital = serializers.IntegerField(read_only=True)
	test = serializers.IntegerField(read_only=True)
	sample = serializers.IntegerField(read_only=True)


	class Meta:

		model = TestResult
		fields = ('id' ,'send_by', 'department', 'laboratory', 'hospital', 'test', 'result', 'sample',
			'comments', 'is_verified', 'is_received', 'date_modified', 'date_added')


	def to_representation(self, instance):

		data = super().to_representation(instance)
		data['send_by'] = instance.send_by.full_name
		data['hospital'] = instance.hospital.name
		data['sample'] = instance.sample.sample_type
		data['department'] = instance.department.department_name
		data['test'] = instance.test.name
		data['laboratory'] = instance.laboratory.name

		return data