from .serializers import (
	UserCreationSerializer, 
	LoginSerializer, 
	VerifyEmailSerializer,
	PasswordResetViewSerializer, 
	SetNewPasswordSerializer, 
	UserSerializer
)
from rest_framework.generics import (
	GenericAPIView, 
	RetrieveAPIView, 
	CreateAPIView,
	UpdateAPIView
)
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from .models import OneTimePassword
from .utils import send_code_to_user
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import smart_str, DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .models import Client
import pyotp
from django.middleware import csrf
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.views import APIView
import jwt
from datetime import timedelta, datetime
from labs.models import (
	BranchManagerInvitation, 
	Branch
)
from labs.serializers import BranchManagerInvitationSerializer
from django.contrib.auth.hashers import make_password
import random
import string



def generate_password(length=12):
	"""Generates a random password of the given length.
	Args:
	length: The desired length of the password (default: 12).
	Returns:
	A random password string.
	"""
	# Define all character sets to be used in the password
	lowercase = string.ascii_lowercase
	uppercase = string.ascii_uppercase
	digits = string.digits
	symbols = string.punctuation
	
	# Combine all character sets
	char_sets = [lowercase, uppercase, digits, symbols]
	
	# Shuffle the character sets for more randomness
	random.shuffle(char_sets)
	
	# Create a password by selecting characters from each set
	password = []
	for char_set in char_sets:
		password.append(random.choice(char_set))
		
		# Ensure the password meets the minimum length requirement
	while len(password) < length:
		password.append(random.choice(random.choice(char_sets)))
		
	# Shuffle the password characters for additional security
	random.shuffle(password)
	# Return the generated password as a string
	
	return ''.join(password)

def verify_token(refresh_token):

	if not 'refresh_token':

		raise InvalidToken('Unauthorized')

	try:
		payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
		user = Client.objects.get(id=payload['user_id'])

	except jwt.ExpiredSignatureError:
		return Response({'error': 'token has expired'}, status=status.HTTP_400_BAD_REQUEST)

	except jwt.DecodeError:
		return Response({'error': 'stale request'}, status=status.HTTP_403_FORBIDDEN)

	except Client.DoesNotExist:
		return Response({'error': 'user does exist'}, status=status.HTTP_404_NOT_FOUND)

	return user




class CheckRefreshToken(APIView):

	serializer_class = UserSerializer

	def get(self, request):
		
		cookie_token = request.COOKIES.get('refresh_token')
		
		try:
			user = verify_token(cookie_token)
			refresh_token = RefreshToken.for_user(user)

		except AttributeError:
			
			return Response({'error': 'Session expired'}, status=status.HTTP_403_FORBIDDEN)

		access_token = str(refresh_token.access_token)
		serialized_data = UserSerializer(user)
		
		return Response({
			'access_token': access_token,
			'data': serialized_data.data

			}, status=status.HTTP_200_OK)


class CreateUserView(CreateAPIView):

	serializer_class = UserCreationSerializer

	def post(self, request, format=None):
		
		return self.create(request)


class VerifyUserEmail(GenericAPIView):

	serializer_class = VerifyEmailSerializer

	def post(self, request):

		code = request.data.get('code')
		
		try:
			user_code_obj = OneTimePassword.objects.get(code=code)
			secret_key = user_code_obj.secrete
			totp = pyotp.TOTP(secret_key, interval=180, digits=10)

			if not totp.verify(totp.now()):

				return Response({'message': 'Invalid or expired code'}, status=status.HTTP_400_BAD_REQUEST)

			user = user_code_obj.user

			if not user.is_verified:

				user.is_verified = True
				user.is_admin = True
				user.save()

				return Response(

						{'message': 'Email successfully verified'},
						status=status.HTTP_200_OK

					)

			return Response(

						{'message': 'Email is already verified.'}, 
						status = status.HTTP_204_NO_CONTENT

					)

		except OneTimePassword.DoesNotExist:

			return Response(

				{
					'message': 'Passcode not provided or is inaccurate'
					}, 
					status=status.HTTP_404_NOT_FOUND

				)


class LoginUserView(GenericAPIView):

	serializer_class = LoginSerializer

	def post(self, request):

		serializer = self.serializer_class(data=request.data, context={'request': request})

		if serializer.is_valid(raise_exception=True):
			try:
				user = Client.objects.get(id=serializer.data['user_id'])

			except Client.DoesNotExist:
				return Response({'error': 'An error occured, try again.'}, status=status.HTTP_404_NOT_FOUND)

			user_tokens = user.tokens()

			response = Response({'data': serializer.data, 'access_token':user_tokens.get('access')}, status=status.HTTP_200_OK)

			response.set_cookie(
					key=settings.SIMPLE_JWT['AUTH_COOKIE'],
					value=user_tokens.get('refresh'),
					domain=settings.SIMPLE_JWT['AUTH_COOKIE_DOMAIN'],
					path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
					expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
					httponly=True,
					secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
					samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
				)

			csrf.get_token(request)

			return response




class PasswordResetView(GenericAPIView):

	serializer_class = PasswordResetViewSerializer

	def post(self, request):

		try:
			serializer = self.serializer_class(data=request.data, context={'request': request})
			serializer.is_valid(raise_exception=True)

		except AssertionError:

			return Response({'error': 'You cannot request password reset with a different email'}, 
				status=status.HTTP_400_BAD_REQUEST)

		return Response({
					'message': 'A link has been sent to your email to reset your password'},
					status=status.HTTP_200_OK)



class PasswordResetConfirm(GenericAPIView):

	def get(self, request, uidb64, token):

		try:

			user_id = smart_str(urlsafe_base64_decode(uidb64))
			user = Client.objects.get(id=user_id)

			if not PasswordResetTokenGenerator().check_token(user, token):

				return Response({
						'message': 'Token is invalid',
					},status=status.HTTP_401_UNAUTHORIZED)

			return Response({
						'success': True,
						'message': 'Valid credentials',
						'uidb64': uidb64,
						'token': token
					},status=status.HTTP_200_OK)

		except DjangoUnicodeDecodeError:

			return Response(
					{'message': 'Decode Error'},
					status=status.HTTP_401_UNAUTHORIZED)




class SetNewPassword(GenericAPIView):

	serializer_class = SetNewPasswordSerializer

	def patch(self, request):

		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid(raise_exception=True):

			return Response({
					'message': 'Password reset successful'
				}, status=status.HTTP_200_OK)




class LogoutView(APIView):

	permission_classes = [IsAuthenticated]

	def post(self, request):
		
		user_cookie_token = request.COOKIES.get('refresh_token')
		if user_cookie_token:

			try:
				token = RefreshToken(user_cookie_token)
				token.blacklist()

			except TokenError as e:

				raise InvalidToken('An error occured')

			response = Response({'message': 'Log out success'},status=status.HTTP_200_OK)
			response.delete_cookie('refresh_token')
			response.delete_cookie('csrftoken')
			return response

		return Response({'message': 'Already logged out'})



class FetchUserData(APIView):

	permission_classes = [IsAuthenticated]
	serializer_class = UserSerializer
	

	def get(self, request, format=None):

		user_cookie_token = request.COOKIES.get('refresh_token')

		if user_cookie_token:

			try:

				user = verify_token(user_cookie_token)

				serialized_data = UserSerializer(user)

				return Response({'data': serialized_data.data}, status=status.HTTP_200_OK)

			except AttributeError:
				return Response({'error': 'User could not be retrieved'}, status=status.HTTP_400_BAD_REQUEST)

			except NameError:
				return Response({'error': 'Argument provided does not make sense'}, status=status.HTTP_400_BAD_REQUEST)

		return Response({'error': 'Token is invalid or you have been logged out.'}, status=status.HTTP_400_BAD_REQUEST)


def create_branch_manager_user(invitation, user_data):
	"""
	Creates a new user with the provided data and sets the account type and staff status.
	"""
	branch = Branch.objects.get(id=invitation.branch_id)
	try:
		client = Client.objects.get(email=invitation.receiver_email)
		branch.branch_manager = client
	except Client.DoesNotExist:
		serializer = UserCreationSerializer(data=user_data)
		serializer.is_valid(raise_exception=True)
		client = serializer.save()
		client.account_type = 'Laboratory'
		client.is_staff = True
		branch.branch_manager = client
		client.save()

	branch.save()
	
	invitation.used = True
	invitation.save()
	
	return client


class BranchManagerAcceptView(UpdateAPIView):
	
	def get_queryset(self):
		"""
		Retrieves the BranchManagerInvitation object based on pk and invitation_code.
		Raises DoesNotExist if not found.
		"""
		pk, invitation_code = self.kwargs.get('pk'), self.kwargs.get('invitation_code')

		try:
			return BranchManagerInvitation.objects.get(pk=pk, invitation_code=invitation_code)
		except DoesNotExist:
			raise Response({'error': 'Invalid invitation'}, status=status.HTTP_400_BAD_REQUEST)
			
	def put(self, request, *args, **kwargs):
		invitation = self.get_queryset()
		if invitation.used:
			return Response({'error': 'Invitation already used'}, status=status.HTTP_400_BAD_REQUEST)

		pwd = generate_password()
		print(pwd)
		data = {
			'email':invitation.receiver_email,
			'first_name':request.data['first_name'],
			'last_name':request.data['last_name'],
			'phone_number':request.data['phone_number'],
			'account_type':'Laboratory',
			'password':pwd,
			'password_confirmation':pwd
		}			
		user = create_branch_manager_user(invitation, data)
		return Response(
			{'message': f'Invitation accepted, you are now a branch manager at {invitation.branch}'}, 
      		status=status.HTTP_200_OK
    	)

class InviteBranchManagerView(CreateAPIView):
	permission_classes = [IsAuthenticated]
	serializer_class = BranchManagerInvitationSerializer

	def perform_create(self, serializer):
		serializer.save(sender=self.request.user)