from rest_framework import serializers
from .models import Hospital, Ward, Sample



class HospitalSerializer(serializers.ModelSerializer):

	class Meta:

		model = Hospital
		fields = ('name', 'region_of_location', 'mailing_address', 'hospital_type',
		 'digital_address', 'phone', 'email', 'website', 'date_modified', 'date_created')


class WardSerializer(serializers.ModelSerializer):

	class Meta:

		model = Ward
		fields = ('hospital', 'ward_type', 'phone', 'ward_manager', 'date_modified', 'date_created')


class SampleSerializer(serializers.ModelSerializer):

	class Meta:

		model = Sample
		fields = ('send_by', 'name_of_patient', 'patient_age', 'patient_sex', 
			'sample_type', 'sample_container', 'delivery', 'lab', 'tests', 
			'hospital', 'ward', 'brief_description', 'date_modified', 'date_created')
