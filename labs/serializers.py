from rest_framework import serializers
from .models import Laboratory, Test, Branch
from .results import TestResult



class LaboratorySerializer(serializers.ModelSerializer):
	logo = serializers.ImageField(required=False)

	class Meta:

		model = Laboratory

		fields = ('id' ,'laboratory_name', 'herfra_id', 
			'main_phone', 'main_email', 'website', 
			'description', 'date_modified', 'date_added', 'logo')





class BranchSerializer(serializers.ModelSerializer):

	branch_name = serializers.StringRelatedField(source='__str__')

	class Meta:

		model = Branch

		fields = ('id' ,'branch_manager', 'laboratory', 'branch_name', 'branch_phone', 
			'branch_email', 'location', 'digital_address', 'region', 'date_modified', 'date_added')


	def to_representation(self, instance):

		data = super().to_representation(instance)
		data['branch_manager'] = instance.branch_manager.full_name
		data['laboratory'] = instance.laboratory.laboratory_name

		return data


class TestSerializer(serializers.ModelSerializer):

	name = serializers.StringRelatedField(source='__str__')

	class Meta:

		model = Test
		fields = ('id' ,'branch', 'name', 'price', 'discount_price', 'date_modified', 'date_added')


	def to_representation(self, instance):

		data = super().to_representation(instance)
		data['branch'] = instance.branch_name
		
		return data




class TestResultSerializer(serializers.ModelSerializer):


	send_by = serializers.IntegerField(read_only=True)
	branch = serializers.IntegerField(read_only=True)
	hospital = serializers.IntegerField(read_only=True)
	test = serializers.IntegerField(read_only=True)
	sample = serializers.IntegerField(read_only=True)
	branch = serializers.StringRelatedField(source='__str__')


	class Meta:

		model = TestResult
		fields = ('id' ,'send_by', 'branch', 'hospital', 'test', 'result', 'sample',
			'comments', 'is_verified', 'is_received', 'date_modified', 'date_added')


	def to_representation(self, instance):

		data = super().to_representation(instance)
		data['send_by'] = instance.send_by.full_name
		data['hospital'] = instance.hospital.name
		data['sample'] = instance.sample.sample_type
		data['test'] = instance.test.name
		data['laboratory'] = instance.laboratory.laboratory_name

		return data