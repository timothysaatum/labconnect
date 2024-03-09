from rest_framework import serializers
from .models import Client


class UserSerializer(serializers.ModelSerializer):

	password = serializers.CharField(max_length=68, min_length=15, write_only=True)
	password_confirmation = serializers.CharField(max_length=68, min_length=15, write_only=True)

	class Meta:

		model = Client

		fields = (
					'email','first_name', 'last_name', 'gender', 'phone_number', 'digital_address', 'emmergency_number', 
					'facility_affiliated_with', 'staff_id', 'password', 'password_confirmation'
				)

	def validate(self, attrs):

		password = attrs.get('password', '')
		password_confirmation = attrs.get('password_confirmation', '')

		if password != password_confirmation:

			raise serializers.ValidationError('Passwords do not match')

		return attrs


	def create(self, validated_data):

		user = Client.objects.create_user(

				email=validated_data.get('email'),
				first_name=validated_data.get('first_name'),
				last_name=validated_data.get('last_name'),
				gender=validated_data.get('gender'),
				phone_number=validated_data.get('phone_number'),
				digital_address=validated_data.get('digital_address'),
				emmergency_number=validated_data.get('emmergency_number'),
				facility_affiliated_with=validated_data.get('facility_affiliated_with'),
				staff_id=validated_data.get('staff_id'),
				password=validated_data.get('password')

			)

		return user











