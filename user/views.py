from .serializers import (
	UserCreationSerializer,
	LoginSerializer,
	VerifyEmailSerializer,
	PasswordResetViewSerializer,
	SetNewPasswordSerializer,
	UserSerializer,
	ComplaintSerializer,
    WaitListSerializer,
    CustomerSupportSerializer
)
from django.db import transaction
from rest_framework.generics import (
	GenericAPIView,
	CreateAPIView,
	UpdateAPIView,
	ListAPIView
)
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import smart_str, DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .models import (
    Client, 
    Complaint, 
    OneTimePassword,
    WaitList,
    CustomerSupport
)
import uuid
import pyotp
from django.middleware import csrf
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.views import APIView
import jwt
from labs.models import (
	BranchManagerInvitation,
	Branch
)
from rest_framework.throttling import UserRateThrottle
from labs.serializers import BranchManagerInvitationSerializer
import random
from .tasks import send_code_to_user, create_user
import string
from django.db.models import Subquery
import logging

logger = logging.getLogger('labs')






def verify_token(refresh_token):
    if not 'refresh_token':
        logger.warning(f"Attempted unauthorized access with token: {refresh_token}")
        raise InvalidToken('Unauthorized')

    try:
        logger.info(f"Submmiting token : {refresh_token} for validation")
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
        logger.info(f"Token : {payload} successfully decoded")
        user = Client.objects.get(id=payload['user_id'])
        logger.info(f"User: {user} retrieved using token data")

    except jwt.ExpiredSignatureError:
        logger.warning(f"A mortal's token has expired in the sands of time.refresh t{refresh_token}")
        return Response({'error': 'token has expired'}, status=status.HTTP_400_BAD_REQUEST)

    except jwt.DecodeError:
        logger.warning(f"Stale token—likely lost in Tartarus: refresh=>{refresh_token}.")
        return Response({'error': 'stale request'}, status=status.HTTP_403_FORBIDDEN)

    except Client.DoesNotExist:
        logger.warning(f"Attempted retrieval of none existen user data using jwt decoded token data: {payload}")
        return Response({'error': 'user does exist'}, status=status.HTTP_404_NOT_FOUND)

    return user


class CheckRefreshToken(APIView):
    throttle_classes = [UserRateThrottle]
    serializer_class = UserSerializer

    def get(self, request):

        cookie_token = request.COOKIES.get("refresh_token")

        try:
            user = verify_token(cookie_token)
            logger.info(f"Hero {user.id} renewed their aegis (token refreshed) successfully.")
            refresh_token = RefreshToken.for_user(user)

        except AttributeError:
            logger.warning(f"The aegis bearer’s power has faded: {cookie_token}")
            return Response(
                {"error": "Session expired"}, status=status.HTTP_403_FORBIDDEN
            )

        access_token = str(refresh_token.access_token)
        serialized_data = UserSerializer(user)

        return Response(
            {"access_token": access_token, "data": serialized_data.data},
            status=status.HTTP_200_OK,
        )



class CreateUserView(CreateAPIView):
    throttle_classes = [UserRateThrottle]
    serializer_class = UserCreationSerializer

    def post(self, request, format=None):
        logger.info(
            f"Account created. Payload: {request.data}"
        )
        return self.create(request)


class UpdateUserAccount(UpdateAPIView):
    throttle_classes = [UserRateThrottle]
    permission_classes = [IsAuthenticated]
    serializer_class = UserCreationSerializer
    partial = True

    def get_queryset(self):
        logger.info(f"{self.request.user.id} requesting account update")
        return Client.objects.filter(pk=self.kwargs.get("pk"))

    def patch(self, request, pk):
        logger.info(f"Updated User, ID: {pk} |payload={request.data}")
        return super().partial_update(request, pk)


class DeleteUserAccount(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserCreationSerializer
    throttle_classes = [UserRateThrottle]

    def get_queryset(self):
        logger.info(f"{self.request.user} requesting account delete")
        return Client.objects.filter(id=self.request.user)

    def delete(self, request, pk):
        logger.warning(f"Deleted User, ID: {pk} | initiator={request.user.id}")
        return super().delete(request, pk)


class VerifyUserEmail(GenericAPIView):
    throttle_classes = [UserRateThrottle]
    serializer_class = VerifyEmailSerializer

    def post(self, request):

        code = request.data.get("code")

        try:
            user_code_obj = OneTimePassword.objects.get(code=code)
            secret_key = user_code_obj.secrete
            totp = pyotp.TOTP(secret_key, interval=180, digits=10)

            if user_code_obj.is_expired():
                logger.warning(f"The Oracle rejected the sacred code: {code}")
                return Response(
                    {"message": "Code has expired code"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not totp.verify(totp.now()):
                logger.warning(f"The Oracle rejected the sacred code: {code}")
                return Response(
                    {"message": "Invalid or expired code"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = user_code_obj.user

            if not user.is_verified:

                user.is_verified = True
                user.is_admin = True
                

                if user.is_branch_manager:
                     user.is_admin = False
                     user.is_staff = True
                     
                if user.is_worker:
                    user.is_admin = False
                    user.is_staff = False

                user.save()
                logger.info(f"Hero with User ID: {user.id} has been blessed by the gods. Verification successful: code {code}")
                return Response(
                    {"message": "Email successfully verified"},
                    status=status.HTTP_200_OK,
                )

            return Response(

						{'message': 'Email is already verified.'},
						status = status.HTTP_204_NO_CONTENT

					)

        except OneTimePassword.DoesNotExist:

            return Response(

				{
					'message': 'OTP code not provided or is inaccurate'
					},
					status=status.HTTP_404_NOT_FOUND

				)


class LoginUserView(GenericAPIView):

    throttle_classes = [UserRateThrottle]
    serializer_class = LoginSerializer


    def post(self, request):
        
        logger.warning(f"Visitor: {request.data} is requesting audience with your majesty")
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )

        if serializer.is_valid(raise_exception=True):
            try:

                user = Client.objects.get(id=serializer.data["user"].get("id"))

            except Client.DoesNotExist:
                logger.warning(f"Request denied for none existent guest, guest info: {request.data}")
                return Response(
                    {"error": "An error occured, try again."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            user_tokens = user.tokens()
            logger.info(f"His majesty has granted access for {user.id}")

            response = Response(
                {"data": serializer.data, "access_token": user_tokens.get("access")},
                status=status.HTTP_200_OK,
            )

            response.set_cookie(
                key=settings.SIMPLE_JWT["AUTH_COOKIE"],
                value=user_tokens.get("refresh"),
                domain=settings.SIMPLE_JWT["AUTH_COOKIE_DOMAIN"],
                path=settings.SIMPLE_JWT["AUTH_COOKIE_PATH"],
                expires=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
                httponly=True,
                secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
            )

            csrf.get_token(request)

            return response


class PasswordResetView(GenericAPIView):
    throttle_classes = [UserRateThrottle]
    serializer_class = PasswordResetViewSerializer

    def post(self, request):

        try:
            serializer = self.serializer_class(
                data=request.data, context={"request": request}
            )
            serializer.is_valid(raise_exception=True)

        except AssertionError:
            logger.warning(f"Failed attempt to reset email: payload=({request.data})")
            return Response(
                {"error": "Invalid email"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        logger.info(f"Initialized link for password reset={request.data}")
        return Response({
					'message': 'A link has been sent to your email to reset your password'},
					status=status.HTTP_200_OK)


class PasswordResetConfirm(GenericAPIView):

    throttle_classes = [UserRateThrottle]

    def get(self, request, uidb64, token):

        try:

            user_id = smart_str(urlsafe_base64_decode(uidb64))
            user = Client.objects.get(id=user_id)
            logger.warning(f"Confirming password reset for user: {user_id}")
            if not PasswordResetTokenGenerator().check_token(user, token):

                logger.warning(f"Inavlid token submitted for password reset{token}")
                return Response(
                    {
                        "message": "Token is invalid",
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            logger.info(f"Password reset request confirmation success for user: {user}")

            return Response({
						'success': True,
						'message': 'Valid credentials',
						'uidb64': uidb64,
						'token': token
					},status=status.HTTP_200_OK)

        except DjangoUnicodeDecodeError:

            logger.warning(f"Attempted user password reset with invalid token data: {uidb64 | token}")
            return Response(
					{'message': 'Decode Error'},
					status=status.HTTP_401_UNAUTHORIZED)


class SetNewPassword(GenericAPIView):
    throttle_classes = [UserRateThrottle]
    serializer_class = SetNewPasswordSerializer

    def patch(self, request):

        serializer = self.serializer_class(data=request.data)
        logger.warning(f"Resetting the user password: New Password = {serializer.data}")
        if serializer.is_valid(raise_exception=True):
            logger.info(f"Password reset success: data={serializer.data}")
            return Response(
                {"message": "Password reset successful"}, status=status.HTTP_200_OK
            )


class LogoutView(APIView):
    throttle_classes = [UserRateThrottle]
    permission_classes = [IsAuthenticated]

    def post(self, request):

        user_cookie_token = request.COOKIES.get("refresh_token")
        if user_cookie_token:

            try:
                token = RefreshToken(user_cookie_token)
                token.blacklist()

            except TokenError as e:

                raise InvalidToken("An error occured")

            response = Response(
                {"message": "Log out success"}, status=status.HTTP_200_OK
            )
            response.delete_cookie("refresh_token")
            response.delete_cookie("csrftoken")
            return response

        return Response({"message": "Already logged out"})


class FetchUserData(APIView):

	throttle_classes = [UserRateThrottle]
	permission_classes = [IsAuthenticated]
	serializer_class = UserSerializer

	def get(self, request, format=None):

		user_cookie_token = request.COOKIES.get('refresh_token')

		if user_cookie_token:

			try:

				user = verify_token(user_cookie_token)
				logger.warning(f'{user.id} accessed profile')
				serialized_data = UserSerializer(user)

				return Response(serialized_data.data, status=status.HTTP_200_OK)

			except AttributeError as e:
				return Response({'error': f'User could not be retrieved{str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

			except NameError:
				return Response({'error': 'Argument provided does not make sense'}, status=status.HTTP_400_BAD_REQUEST)

		return Response({'error': 'Token is invalid or you have been logged out.'}, status=status.HTTP_400_BAD_REQUEST)


def create_branch_manager_user(invitation, user_data):
    """
    Handles branch_manager creation
    -If branch_manager_id is provided, assigns the branch_manager to the specified branch
    -If new branch_manager, creates and assign the branch_manager
    """
    branch = Branch.objects.select_related('branch_manager').get(id=invitation.branch_id)

    try:
        
        #Existing branch_manager case
        
        client = Client.objects.get(email=invitation.receiver_email)
        if not client.is_branch_manager:
            
            client.is_admin = False
            client.is_staff = True
            client.save()


    except Client.DoesNotExist:

        #New branch_manager case
        with transaction.atomic():
            serializer = UserCreationSerializer(data=user_data)
            serializer.is_valid(raise_exception=True)
            client = serializer.save(
                 is_branch_manager=True, 
                 is_admin=False, 
                 is_staff=True, 
                 is_worker=False, 
                 account_type='Laboratory'
                )

        branch.branch_manager = client

    branch.save()
    invitation.mark_as_used()


    return client



class BranchManagerAcceptView(CreateAPIView):

	throttle_classes = [UserRateThrottle]

	def get_queryset(self):
		"""
		Retrieves the BranchManagerInvitation object based on pk and invitation_code.
        Raises DoesNotExist if not found.
        """
		pk, invitation_code = self.kwargs.get('pk'), self.kwargs.get('invitation_code')
		try:
			return BranchManagerInvitation.objects.get(pk=pk, invitation_code=invitation_code)
		except BranchManagerInvitation.DoesNotExist:

			return Response({'error': 'Invitation does not exist'}, status=status.HTTP_404_NOT_FOUND)


	def post(self, request, *args, **kwargs):
		invitation = self.get_queryset()

		if invitation.used:
			return Response({'error': 'Invitation already used'}, status=status.HTTP_400_BAD_REQUEST)

		data = {
			'email':invitation.receiver_email,
			'first_name':request.data['first_name'],
			'last_name':request.data['last_name'],
			'phone_number':request.data['phone_number'],
			'account_type':'Laboratory',
			'password':request.data['password'],
			'password_confirmation':request.data['password_confirmation']
		}

		create_branch_manager_user(invitation, data)
		return Response(
			{'message': f'Invitation accepted, you are now a branch manager at {invitation.branch}'},
      		status=status.HTTP_200_OK
    	)


class AddWorker(CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        branches = request.data.get("branches", [])

        # Allow only admins or branch managers

        if not (request.user.is_admin or request.user.is_branch_manager):
            return Response({"message": "Illegal request"}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure user can assign the branches
        branches = [uuid.UUID(b_id) for b_id in branches]
        user_branches = set(request.user.branch_set.values_list("id", flat=True))

        if not set(branches).issubset(user_branches):
            return Response({"message": "Illegal request"}, status=status.HTTP_400_BAD_REQUEST)

        # Create or update the user
        user_data = request.data
        create_user.send(user_data)

        return Response(
            {"message": "User is being processed"},
            status=status.HTTP_201_CREATED,
        )


class InviteBranchManagerView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle]
    serializer_class = BranchManagerInvitationSerializer

    def perform_create(self, serializer):

        serializer.save(sender=self.request.user)


class FetchLabManagers(ListAPIView):

    throttle_classes = [UserRateThrottle]
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_queryset(self):

        managers = (
            Branch.objects.filter(laboratory_id=self.kwargs.get("pk"))
            .values("branch_manager")
            .distinct()
        )

        branch_managers = Client.objects.filter(id__in=Subquery(managers))

        return branch_managers


class RequestNewOTP(CreateAPIView):

    throttle_classes = [UserRateThrottle]

    def post(self, request, *args, **kwargs):

        user_email = request.data["email"]

        try:
            c = Client.objects.get(email=user_email)

        except Client.DoesNotExist:
            return Response(
                {"error": f"An error occured"}, status=status.HTTP_400_BAD_REQUEST
            )

        if c.is_verified:
            return Response(
                {"error": f"Already verified"}, status=status.HTTP_400_BAD_REQUEST
            )

        send_code_to_user.send(user_email)
        return Response({"message": f"Code sent"}, status=status.HTTP_200_OK)


class ComplaintViewSet(viewsets.ModelViewSet):

    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Customers can only see their own complaints
        return Complaint.objects.filter(customer=self.request.user)

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    def update(self, request, *args, **kwargs):
        complaint = self.get_object()
        if complaint.status != 'pending':
            return Response({"error": "You can only update complaints that are pending."}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        complaint = self.get_object()
        if complaint.status != 'pending':
            return Response({"error": "You can only delete complaints that are pending."}, status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(request, *args, **kwargs)
    

class WaitListApplicantsViewSet(viewsets.ModelViewSet):
    
    throttle_classes = [UserRateThrottle]
    queryset = WaitList.objects.all().order_by("-joint_at")
    serializer_class = WaitListSerializer



class CustomerSupportMessageViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAuthenticated]
    queryset = CustomerSupport.objects.all().order_by('-created_at')
    queryset = CustomerSupport.objects.all().order_by("-created_at")
    serializer_class = CustomerSupportSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)