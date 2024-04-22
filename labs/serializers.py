from rest_framework import serializers
from .models import Laboratory, Department, Test
from .results import TestResult



class LaboratorySerializer(serializers.ModelSerializer):
	logo = serializers.ImageField(required=False)

	class Meta:

		model = Laboratory
		fields = ('id' ,'name', 'region_of_location', 'town_of_location', 'herfra_id', 'digital_address', 'phone', 'email', 'website', 
			'description', 'date_modified', 'date_added', 'logo')




class DepartmentSerializer(serializers.ModelSerializer):

	class Meta:

		model = Department
		fields = ('id' ,'department_name', 'heard_of_department', 'phone', 'email', 'date_modified', 'date_added')




class TestSerializer(serializers.ModelSerializer):

	class Meta:

		model = Test
		fields = ('id' ,'department', 'name', 'price', 'discount_price', 'date_modified', 'date_added')




class TestResultSerializer(serializers.ModelSerializer):

	class Meta:

		model = TestResult
		fields = ('id' ,'send_by', 'department', 'laboratory', 'test', 'result', 
			'comments', 'is_verified', 'is_received', 'date_modified', 'date_added')




class LaboratoryDetailViewSerializer(serializers.ModelSerializer):

	class Meta:
		model = Laboratory
		fields = ('created_by', 'name', 'herfra_id', 'digital_address', 'phone', 'email', 'website', 
			'description', 'date_modified', 'date_added', 'logo')