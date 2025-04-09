from rest_framework import serializers
from .models import Client, OneTimePassword, Complaint
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import smart_bytes, force_str
from django.urls import reverse
from labs.models import Laboratory, Branch
from .utils import send_normal_email, send_code_to_user
from labs.serializers import LaboratorySerializer, BranchSerializer
from hospital.models import Hospital
from hospital.serializers import HospitalSerializer
from django.db.models import Q
import uuid
import logging
from django.db import transaction



logger = logging.getLogger(__name__)




class UserCreationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=68, min_length=8, write_only=True)
    password_confirmation = serializers.CharField(
        max_length=68, min_length=8, write_only=True
    )
    account_type = serializers.CharField(
        max_length=68, min_length=10, required=False
    )
    is_admin = serializers.BooleanField(read_only=True)
    is_staff = serializers.BooleanField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    is_worker = serializers.BooleanField(required=False)
	
	
    class Meta:
		
        model = Client
		
        fields = (
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "account_type",
            "is_admin",
            "is_staff",
            "is_active",
            "is_worker",
            "password",
            "password_confirmation",
        )
		
    def validate(self, attrs):
		
        password = attrs.get("password", "")
        password_confirmation = attrs.get("password_confirmation", "")


        if password != password_confirmation:
	
            raise serializers.ValidationError("Passwords do not match")

        return attrs

    def create(self, validated_data):
        _ = validated_data.pop("password_confirmation")
        user = Client.objects.create_user(
			**validated_data
        )
        
        return user



class NaiveUserSerializer(serializers.ModelSerializer):
	
	class Meta:

		model = Client

		fields = [
					'id', 
					'email', 
					'first_name', 
					'last_name', 
					'phone_number',
					'account_type',
					'is_staff', 
					'is_active', 
					'is_admin',
					'is_branch_manager',
					'is_worker',
					'is_an_individual',
					'is_verified', 
					'date_joined', 
					'last_login',
				]


class LoginSerializer(serializers.ModelSerializer):

	email = serializers.EmailField(max_length=200, min_length=5, write_only=True)
	password = serializers.CharField(max_length=200, write_only=True)
	lab = serializers.PrimaryKeyRelatedField(read_only=True ,many=True)
	branch = serializers.PrimaryKeyRelatedField(read_only=True ,many=True)
	hospital = serializers.PrimaryKeyRelatedField(read_only=True ,many=True)
	user = serializers.PrimaryKeyRelatedField(read_only=True, many=True)

	class Meta:

		model = Client

		fields = [

			'user', 'email', 'password','lab', 'branch', 'hospital'
		]

	def validate(self, attrs):

		username = attrs.get('email')
		password = attrs.get('password')
		request = self.context.get('request')
				
		user = authenticate(request, email=username, password=password)
		if not user:
			raise AuthenticationFailed('Invalid Credentials!')
		if not user.is_verified:
			send_code_to_user(user.email)
			raise AuthenticationFailed('Unverified user, New verification code sent to your email. Verify your email to login')
		return user

	def to_representation(self, instance):

		data = super().to_representation(instance)

		data['user'] = NaiveUserSerializer(instance).data

		if instance.account_type == 'Laboratory':

			data['lab'] = LaboratorySerializer(Laboratory.objects.filter(created_by=instance.id), many=True).data
			data['branch'] = BranchSerializer(Branch.objects.filter(Q(laboratory__created_by=instance.id) | Q(branch_manager_id=instance.id)), many=True).data
			
			if instance.is_branch_manager:
			    
			    branch_manager_labs = Laboratory.objects.filter(branches__branch_manager=instance).distinct()
			    data['lab'] += LaboratorySerializer(branch_manager_labs, many=True).data
			    
			if instance.is_worker:
			    
			    worker_branches = instance.work_branches.all()
			    data['branch'] += BranchSerializer(worker_branches, many=True).data

		if instance.account_type == 'Hospital':
			data['hospital'] = HospitalSerializer(Hospital.objects.filter(created_by=instance.id), many=True).data

		return data


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
			# site_domain = get_current_site(request).domain

			relative_link = reverse('user:password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
			# abslink = f'http://{site_domain}{relative_link}'
			abslink = f'https://labconnekt.com{relative_link}'
			email_body = f'Hi {user.full_name}, use the link below to reset your password \n {abslink}'

			data = {
				'email_body': email_body,
				'email_subject': 'Reset your password',
				'to_email': user.email
			}

			send_normal_email(data)
			
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
	lab = serializers.PrimaryKeyRelatedField(read_only=True ,many=True)
	branch = serializers.PrimaryKeyRelatedField(read_only=True ,many=True)
	hospital = serializers.PrimaryKeyRelatedField(read_only=True ,many=True)
	user = serializers.PrimaryKeyRelatedField(read_only=True ,many=True)
	class Meta:

		model = Client

		fields = [
					'user',
					'lab',
					'branch',
					'hospital'
				]

	def to_representation(self, instance):

		data = super().to_representation(instance)
		data['user'] = NaiveUserSerializer(instance).data
		
		if instance.account_type == 'Laboratory':
			
			data['lab'] = LaboratorySerializer(Laboratory.objects.filter(created_by=instance), many=True).data
			data['branch'] = BranchSerializer(Branch.objects.filter(Q(laboratory__created_by=instance) | Q(branch_manager_id=instance.id)), many=True).data
			
			if instance.is_branch_manager:
			    
			    branch_manager_labs = Laboratory.objects.filter(branches__branch_manager=instance).distinct()
			    data['lab'] += LaboratorySerializer(branch_manager_labs, many=True).data
			    
			if instance.is_worker:
			    
			    worker_branches = instance.work_branches.all()
			    data['branch'] += BranchSerializer(worker_branches, many=True).data

		if instance.account_type == 'Hospital':
			data['hospital'] = HospitalSerializer(Hospital.objects.filter(created_by=instance), many=True).data
			
		return data


class NewOPTSerializer(serializers.Serializer):
	email = serializers.CharField(max_length=50)

	class Meta:
		fields = [
			'email'
		]


class ComplaintSerializer(serializers.ModelSerializer):
    customer = serializers.ReadOnlyField(source='client.username')

    class Meta:
        model = Complaint
        fields = ['id', 'customer', 'subject', 'description', 'status', 'created_at', 'updated_at']
        read_only_fields = ['status', 'created_at', 'updated_at']