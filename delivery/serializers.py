from rest_framework import serializers
from .models import Delivery, PriceModel


class DeliverySerializer(serializers.ModelSerializer):

	class Meta:

		model = Delivery

		fields = (
			'id',
			'created_by',
			'name', 
			'digital_address', 
			'phone', 
			'email', 
			'website', 
			'service_fee', 
			'date_modified', 
			'date_added'
		)

		def to_representation(self, instance):
			data = super().to_representation(instance)
			data['created_by'] = instance.__str__()


class PriceModelSerializer(serializers.ModelSerializer):

	class Meta:

		model = PriceModel

		fields = (
			'id', 
			'distance',
			'price', 
			'date_modified', 
			'date_added'
		)
