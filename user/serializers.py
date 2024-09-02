from rest_framework import serializers
from .models import Client, OneTimePassword
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import smart_bytes, force_str
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from .utils import send_normal_email




class UserCreationSerializer(serializers.ModelSerializer):

	password = serializers.CharField(max_length=68, min_length=8, write_only=True)
	password_confirmation = serializers.CharField(max_length=68, min_length=8, write_only=True)
	is_admin = serializers.CharField(max_length=10, read_only=True)
	is_staff = serializers.CharField(max_length=10, read_only=True)
	is_active = serializers.CharField(max_length=10, read_only=True)

	class Meta:

		model = Client

		fields = (
					'email', 'first_name', 'last_name', 'phone_number',
					'id_number', 'digital_address', 'emmergency_contact',
					'bio', 'account_type', 'is_admin', 'is_staff', 'is_active',
					'password', 'password_confirmation'
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
				phone_number=validated_data.get('phone_number'),
				id_number=validated_data.get('id_number'),
				digital_address=validated_data.get('digital_address'),
				emmergency_contact=validated_data.get('emmergency_contact'),
				bio=validated_data.get('bio'),
				account_type=validated_data.get('account_type'),
				password=validated_data.get('password')
			)

		return user


class LoginSerializer(serializers.ModelSerializer):

	email = serializers.EmailField(max_length=200, min_length=5)
	password = serializers.CharField(max_length=200, write_only=True)
	full_name = serializers.CharField(max_length=255, read_only=True)
	account_type = serializers.CharField(max_length=255, read_only=True)
	is_branch_manager = serializers.BooleanField(read_only=True)
	is_staff = serializers.CharField(max_length=255, read_only=True)
	is_active = serializers.CharField(max_length=255, read_only=True)
	is_admin = serializers.CharField(max_length=255, read_only=True)
	is_verified = serializers.CharField(max_length=255, read_only=True)
	user_id = serializers.IntegerField(read_only=True)

	class Meta:

		model = Client

		fields = [

			'user_id', 'email', 'password', 'full_name', 'account_type',
			'is_staff', 'is_verified', 'is_active', 'is_admin', 'is_branch_manager'
		]

	def validate(self, attrs):

		username = attrs.get('email')
		password = attrs.get('password')

		request = self.context.get('request')

		user = authenticate(request, email=username, password=password)

		if not user:

			raise AuthenticationFailed('Invalid Credentials!')

		if not user.is_verified:

			raise AuthenticationFailed('Email is not verified!')

		return {

			'user_id': user.id,
			'full_name': user.full_name,
			'is_staff': user.is_staff,
			'is_verified': user.is_verified,
			'is_active': user.is_active,
			'is_admin': user.is_admin,
			'account_type': user.account_type,
			'first_name': user.first_name,
			'email':user.email,
			'is_branch_manager': user.is_branch_manager
		}


class VerifyEmailSerializer(serializers.ModelSerializer):

	class Meta:

		model = OneTimePassword
		fields = ['code']


class PasswordResetViewSerializer(serializers.Serializer):

	email = serializers.EmailField(max_length=255)

	class Meta:

		fields = ['email']

	def validate(self, attrs):

		email = attrs.get('email')

		if Client.objects.filter(email=email).exists():

			user = Client.objects.get(email=email)
			
			if not user.is_verified:

				raise AuthenticationFailed("You cannot iniated password reset because you didn't verify your email")

			uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
			token = PasswordResetTokenGenerator().make_token(user)

			request = self.context.get('request')

			#domain of the front end
			site_domain = get_current_site(request).domain

			relative_link = reverse('user:password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
			# abslink = f'http://{site_domain}{relative_link}'
			abslink = f'http://localhost:5173{relative_link}'
			email_body = f'Hi {user.full_name}, use the link below to reset your password \n {abslink}'

			data = {
				'email_body': email_body,
				'email_subject': 'Reset your password',
				'to_email': user.email
			}

			send_normal_email(data)
			print(abslink)
			return {

				'user': user,
				'uidb64': uidb64,
				'token': token

			}


class SetNewPasswordSerializer(serializers.Serializer):

	password = serializers.CharField(max_length=100, min_length=8,write_only=True)
	password_confirmation = serializers.CharField(max_length=100, min_length=8,write_only=True)
	uidb64 = serializers.CharField(write_only=True)
	token = serializers.CharField(write_only=True)

	class Meta:
		fields = ['password', 'password_confirmation', 'uidb64', 'token']


	def validate(self, attrs):

		try:
			token = attrs.get('token')
			uidb64 = attrs.get('uidb64')
			print(uidb64)
			password = attrs.get('password')
			password_confirmation = attrs.get('password_confirmation')

			user_id = force_str(urlsafe_base64_decode(uidb64))

			user = Client.objects.get(id=user_id)

			if not PasswordResetTokenGenerator().check_token(user, token):

				raise AuthenticationFailed('Reset link is invalid or has expired', 401)

			if password != password_confirmation:

				raise AuthenticationFailed('Passwords do not match')

			user.set_password(password)
			user.save()
			return user

		except Exception as e:

			raise AuthenticationFailed("An error occured. Either the link has expired or is invalid")


class UserSerializer(serializers.ModelSerializer):
	# profile = serializers.PrimaryKeyRelatedField(read_only=True ,many=True)
	class Meta:

		model = Client

		fields = [
					'id', 
					'email', 
					'first_name', 
					'last_name', 
					'phone_number',
					'account_type',
					# 'profile',
					'is_staff', 
					'is_active', 
					'is_admin',
					'is_branch_manager', 
					'is_verified', 
					'date_joined', 
					'last_login',
				]

	# def to_representation(self, instance):
	# 	data = super().to_representation(instance)
	# 	data['profile'] = ClientProfileSerializer(ClientProfile.objects.filter(client=instance.id), many=True).data
	# 	return data