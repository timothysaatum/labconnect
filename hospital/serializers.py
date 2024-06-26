from rest_framework import serializers
from .models import Hospital
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
