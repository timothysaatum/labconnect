from rest_framework import serializers
from .models import Hospital, Sample
from labs.models import Test
from labs.paginators import QueryPagination



class HospitalSerializer(serializers.ModelSerializer):

	name = serializers.StringRelatedField(source='__str__')

	class Meta:

		model = Hospital
		fields = (
			'id', 
			'name', 
			'region_of_location', 
			'mailing_address', 
			'hospital_type',
		 	'digital_address', 
		 	'phone', 
			'email', 
			'website', 
			'date_modified', 
			'date_created'
		)

	pagination_class = QueryPagination


class SampleSerializer(serializers.ModelSerializer):

	patient_age = serializers.IntegerField()
	attachment = serializers.FileField(required=False)
	send_by = serializers.PrimaryKeyRelatedField(read_only=True)
	tests = serializers.PrimaryKeyRelatedField(many=True, queryset=Test.objects.all())

	class Meta:

		model = Sample

		fields = (
			'id', 
			'send_by', 
			'hospital', 
			'name_of_patient', 
			'patient_age', 
			'patient_sex',
			'delivery', 
			'is_paid', 
			'is_received_by_delivery', 
			'is_delivered_to_lab', 
			'is_access_by_lab', 
			'sample_type', 
			'lab', 
			'tests', 
			'brief_description', 
			'attachment', 
			'date_modified', 
			'date_created'
		)
	pagination_class = QueryPagination


	def to_representation(self, instance):

		data = super().to_representation(instance)
		data['tests'] = [test.name for test in instance.tests.all()]
		data['send_by'] = instance.send_by.full_name
		data['hospital'] = instance.hospital.name
		data['lab'] = instance.lab.branch_name

		if data['delivery']:
			
			data['delivery'] = instance.delivery.name

		return data