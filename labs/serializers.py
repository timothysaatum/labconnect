from rest_framework import serializers
from .models import Laboratory, Department, Test, TestResult


class DeliverySerializer(serializers.ModelSerializer):

	class Meta:

		model = Laboratory
		fields = ('created_by','name', 'departments', 'herfra_id', 'digital_address', 'phone', 'email', 'website', 
			'description', 'date_modified', 'date_added')


class DepartmentSerializer(serializers.ModelSerializer):

	class Meta:

		model = Department
		fields = ('created_by','laboratory', 'department_name', 'phone', 'email', 'date_modified', 'date_added')


class TestSerializer(serializers.ModelSerializer):

	class Meta:

		model = Test
		fields = ('created_by','laboratory', 'department_name', 'tests', 'date_modified', 'date_added')


class TestResultSerializer(serializers.ModelSerializer):

	class Meta:

		model = TestResult
		fields = ('created_by','send_by', 'department', 'laboratory', 'test', 'result', 
			'comments', 'is_verified', 'is_received', 'date_modified', 'date_added')
