from rest_framework import serializers
from .models import Delivery


class DeliverySerializer(serializers.ModelSerializer):

	class Meta:

		model = Delivery

		fields = ('created_by','name', 'digital_address', 'phone', 'email', 'website', 
			'service_fee', 'date_modified', 'date_added')
