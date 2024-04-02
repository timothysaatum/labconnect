from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.contrib import messages
from rest_framework import viewsets
from .serializers import (UserSerializer, LoginSerializer,VerifyEmailSerializer, LogoutSerializer,
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



class CreateUserView(GenericAPIView):

	serializer_class = UserSerializer

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
			user = user_code_obj.user

			if not user.is_verified:

				user.is_verified = True
				user.is_admin = True
				user.save()

				return Response(

						{'message': 'Account successfully verified'},
						status=status.HTTP_200_OK

					)

			return Response(

						{'message': 'Token has expired'}, 
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

		self.response.set_cookie(

				key='refresh_token',
				value=settings.COOKIE_VALUE,
				httponly=True,
				secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
				samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
			)
		
		self.response.data = {'data': serializer.data, 'status' :status.HTTP_200_OK}

		return self.response


class TestAuthenticationView(GenericAPIView):

	permission_classes = [IsAuthenticated]

	def get(self, request):

		data = {

			'msg': 'It works'
		}

		return Response(data, status=status.HTTP_200_OK)


class PasswordResetView(GenericAPIView):

	serializer_class = PasswordResetViewSerializer

	def post(self, request):

		serializer = self.serializer_class(data=request.data, context={'request': request})
		serializer.is_valid(raise_exception=True)

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
					},status=status.HTTP_401_NOT_UNAUTHORIZED)

			return Response({
						'success': True,
						'message': 'Valid credentials',
						'uidb64': uidb64,
						'token': token
					},status=status.HTTP_200_OK)

		except DjangoUnicodeDecodeError:

			return Response(
					{'message': 'Decode Error'},
					status=status.HTTP_401_NOT_UNAUTHORIZED)


class SetNewPassword(GenericAPIView):

	serializer_class = SetNewPasswordSerializer

	def patch(self, request):

		serializer = self.serializer_class(data=request.data)
		serializer.is_valid(raise_exception=True)

		return Response({
				'message': 'Password reset successful'
			}, status=status.HTTP_200_OK)


class LogoutView(GenericAPIView):

	serializer_class = LogoutSerializer
	permission_classes = [IsAuthenticated]

	def post(self, request):
		 serializer = self.serializer_class(data=request.data)
		 serializer.is_valid(raise_exception=True)
		 serializer.save()

		 return Response(status=status.HTTP_204_NO_CONTENT)