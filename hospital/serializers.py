from rest_framework import serializers
from .models import Hospital, HospitalLab
from labs.paginators import QueryPagination



class HospitalSerializer(serializers.ModelSerializer):

	class Meta:

		model = Hospital

		fields = (
			'id', 
			'name', 
			'region',
			'postal_address',
			'hospital_type',
		 	'digital_address',
		 	'phone',
			'email',
			'website',
			'date_modified',
			'date_created'
		)

	pagination_class = QueryPagination


class HospitalLabSerializers(serializers.ModelSerializer):

	class Meta:

		model = HospitalLab
		
	fields = (
			'id', 
			'name', 
			'hospital_reference',
			'date_modified',
			'date_created'
		)