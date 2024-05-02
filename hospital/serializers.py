from rest_framework import serializers
from .models import Hospital, Sample
from labs.models import Test
from labs.serializers import TestSerializer



class HospitalSerializer(serializers.ModelSerializer):

	class Meta:

		model = Hospital
		fields = ('name', 'region_of_location', 'mailing_address', 'hospital_type',
		 'digital_address', 'phone', 'email', 'website', 'date_modified', 'date_created')


class SampleSerializer(serializers.ModelSerializer):

	patient_age = serializers.DateField(format='%Y-%m-%d')
	attachment = serializers.FileField(required=False)
	send_by = serializers.IntegerField(read_only=True)
	#hospital = serializers.IntegerField(read_only=True)
	tests = serializers.PrimaryKeyRelatedField(many=True, queryset=Test.objects.all())

	class Meta:

		model = Sample

		fields = ('id', 'send_by', 'hospital', 'name_of_patient', 'patient_age', 'patient_sex', 'delivery', 'is_paid',
			'is_received_by_delivery', 'is_delivered_to_lab', 'is_access_by_lab', 'sample_type', 'sample_container', 
			'lab', 'tests', 'brief_description', 'attachment', 'date_modified', 'date_created')

	def to_representation(self, instance):

		data = super().to_representation(instance)
		data['tests'] = [test.name for test in instance.tests.all()]
		data['send_by'] = instance.send_by.full_name
		data['hospital'] = instance.hospital.name
		data['delivery'] = instance.delivery.name
		data['lab'] = instance.lab.name

		return data