from .serializers import (UserCreationSerializer, LoginSerializer, VerifyEmailSerializer,
	PasswordResetViewSerializer, SetNewPasswordSerializer)
from rest_framework.generics import GenericAPIView
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





def generate_token(user):

	refresh = RefreshToken.for_user(user)

	return refresh


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

	def get(self, request):
		
		cookie_token = request.COOKIES.get('refresh_token')
		
		user = verify_token(cookie_token)

		refresh_token = generate_token(user)

		access_token = str(refresh_token.access_token)
		
		return Response({
			'access_token': access_token,
			'user':{
			'full_name': user.full_name,
			'current_facility': user.current_facility, 
			'staff_id': user.staff_id,
			'is_staff': user.is_staff,
			'email': user.email,
			'gender': user.gender,
			'phone_number': user.phone_number,
			'digital_address': user.digital_address,
			'is_verified': user.is_verified, 
			'is_active': user.is_active, 
			'is_admin': user.is_admin, 
			'profile_picture': user.profile_picture_url,
			'account_type': user.account_type, 
			'email':user.email,
			'user_id': user.id,
			'date_joined': user.date_joined,
			'last_login': user.last_login,
			}
			}, status=status.HTTP_200_OK)
		


class CreateUserView(GenericAPIView):

	serializer_class = UserCreationSerializer

	def post(self, request):

		user_data = request.data
		serializer=self.serializer_class(data=user_data)

		if serializer.is_valid(raise_exception=True):

			serializer.save()
			user_data = serializer.data
			send_code_to_user(user_data['email'])

			return Response(

					{'data': user_data, 'message': 'Account created successfully, otp was sent, please verify your account.'},
					status=status.HTTP_201_CREATED

				)

		return Response(serializer.erros, status.HTTP_400_BAD_REQUEST)



class VerifyUserEmail(GenericAPIView):

	serializer_class = VerifyEmailSerializer

	def post(self, request):

		optcode = request.data.get('code')
		
		try:

			user_code_obj = OneTimePassword.objects.get(code=optcode)
			secret_key = user_code_obj.secrete
			totp = pyotp.TOTP(secret_key, interval=180, digits=10)
			is_valid = totp.verify(totp.now())

			if is_valid == False:

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
					'message': 'Passcode not provided is inaccurate'
					}, 
					status=status.HTTP_404_NOT_FOUND

				)




class LoginUserView(GenericAPIView):

	response = Response()
	serializer_class = LoginSerializer

	def post(self, request):

		serializer = self.serializer_class(data=request.data, context={'request': request})
		serializer.is_valid(raise_exception=True)
		try:
			user = Client.objects.get(id=serializer.data['user_id'])

		except Client.DoesNotExist:
			return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

		user_tokens = user.tokens()

		refresh = user_tokens.get('refresh')
		
		self.response.set_cookie(
				key=settings.SIMPLE_JWT['AUTH_COOKIE'],
				value=refresh,
				domain=settings.SIMPLE_JWT['AUTH_COOKIE_DOMAIN'],
				path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'],
				expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
				httponly=True,
				secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
				samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
			)

		csrf.get_token(request)
		
		self.response.data = {'data': serializer.data, 'access_token': user_tokens.get('access'), 'status' :status.HTTP_200_OK}

		return self.response




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
		serializer.is_valid(raise_exception=True)

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
				raise serializers.ValidationError(str(e))

			response = Response({'message': 'Log out success'},status=status.HTTP_200_OK)
			response.delete_cookie('refresh_token')
			response.delete_cookie('csrftoken')
			return response

		return Response({'message': 'Already logged out'})



class FetchUserData(APIView):

	permission_classes = [IsAuthenticated]
	
	def get(self, request):

		user_cookie_token = request.COOKIES.get('refresh_token')

		if user_cookie_token:

			try:
				user = verify_token(user_cookie_token)

			except Exception as e:
				return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


			return Response({'full_name': user.full_name,
				'current_facility': user.current_facility, 
				'staff_id': user.staff_id,
				'is_staff': user.is_staff, 
				'is_verified': user.is_verified, 
				'is_active': user.is_active, 
				'is_admin': user.is_admin,
				'profile_picture': user.profile_picture_url, 
				'account_type': user.account_type, 
				'email': user.email,
				'gender': user.gender,
				'phone_number': user.phone_number,
				'digital_address': user.digital_address,
				'emmergency_number': user.emmergency_number,
				'current_facility': user.current_facility,
				'date_joined': user.date_joined,
				'last_login': user.last_login,
				'user_id': user.id
				}, status=status.HTTP_200_OK)

		return Response({'error': 'Token is invalid or you have been logged out.'}, status=status.HTTP_400_BAD_REQUEST)