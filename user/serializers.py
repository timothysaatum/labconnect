from rest_framework import serializers
from .models import Client, OneTimePassword
from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import smart_str, smart_bytes, force_str
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from .utils import send_normal_email
from rest_framework_simplejwt.tokens import RefreshToken, TokenError





class UserSerializer(serializers.ModelSerializer):

	password = serializers.CharField(max_length=68, min_length=8, write_only=True)
	password_confirmation = serializers.CharField(max_length=68, min_length=8, write_only=True)

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

	def send_email(self, to_email, first_name, last_name):

		from_email = settings.EMAIL_HOST_USER
		to_email = to_email

		user_full_name = f'{first_name} {last_name}'
		context = {'user_full_name': user_full_name}

		html_template = 'user/email_msg.html'
		html_message = render_to_string(html_template, context=context)
		subject = 'Account created successfully'
		plain_message = strip_tags(html_message)
		message = EmailMessage(subject, html_message, from_email, [to_email])
		message.content_type = 'html'
		message.send()


class LoginSerializer(serializers.ModelSerializer):

	email = serializers.EmailField(max_length=200, min_length=5)
	password = serializers.CharField(max_length=200, write_only=True)
	access_token = serializers.CharField(max_length=255, read_only=True)
	refresh_token = serializers.CharField(max_length=255, read_only=True)
	full_name = serializers.CharField(max_length=255, read_only=True)

	class Meta:

		model = Client
		fields = ['email', 'password', 'full_name', 'access_token', 'refresh_token']

	def validate(self, attrs):

		username = attrs.get('email')
		password = attrs.get('password')

		request = self.context.get('request')

		user = authenticate(request, email=username, password=password)

		if not user:

			raise AuthenticationFailed('User does not exist!')

		if not user.is_verified:

			raise AuthenticationFailed('Email is not verified!')

		user_tokens = user.tokens()

		return {

			'email':user.email,
			'full_name': user.full_name,
			'access_token': user_tokens.get('access'),
			'refresh_token': user_tokens.get('refresh')

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
			uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
			token = PasswordResetTokenGenerator().make_token(user)

			request = self.context.get('request')

			#domain of the front end
			site_domain = get_current_site(request).domain

			relative_link = reverse('user:password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
			abslink = f'http://{site_domain}{relative_link}'
			email_body = f'Hi {user.full_name}, use the link below to reset your password \n {abslink}'

			data = {
				'email_body': email_body, 
				'email_subject': 'Reset your password',
				'to_email': user.email
			}

			send_normal_email(data)
			print(abslink, email_body)
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


class LogoutSerializer(serializers.Serializer):

	refresh_token = serializers.CharField()

	def validate(self, attrs):

		self.token = attrs.get('refresh_token')

		return attrs


	def save(self, **kwargs):

		try:
			token = RefreshToken(self.token)
			token.blacklist()

		except TokenError:
			return self.fail('bad_token', 'Token is invalid or has expired')

