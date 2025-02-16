from rest_framework import serializers
from .models import Client, OneTimePassword
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import smart_bytes, force_str
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from labs.models import Laboratory, Branch
from .utils import send_normal_email, send_code_to_user
from labs.serializers import LaboratorySerializer, BranchSerializer
from hospital.models import Hospital
from hospital.serializers import HospitalSerializer
from django.db.models import Q


class UserCreationSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new user account.
    Ensures password confirmation and provides read-only fields for user status.
    """

    password = serializers.CharField(max_length=68, min_length=8, write_only=True)
    password_confirmation = serializers.CharField(
        max_length=68, min_length=8, write_only=True
    )
    is_admin = serializers.CharField(max_length=10, read_only=True)
    is_staff = serializers.CharField(max_length=10, read_only=True)
    is_active = serializers.CharField(max_length=10, read_only=True)

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
            "password",
            "password_confirmation",
        )

    def validate(self, attrs):
        """
        Validate that the password and confirmation match.
        """
        password = attrs.get("password", "")
        password_confirmation = attrs.get("password_confirmation", "")

        if password != password_confirmation:
            raise serializers.ValidationError("Passwords do not match")

        return attrs

    def create(self, validated_data):
        """
        Create and return a new user instance with encrypted password.
        """
        user = Client.objects.create_user(
            email=validated_data.get("email"),
            first_name=validated_data.get("first_name"),
            last_name=validated_data.get("last_name"),
            phone_number=validated_data.get("phone_number"),
            account_type=validated_data.get("account_type"),
            password=validated_data.get("password"),
        )

        return user


class NaiveUserSerializer(serializers.ModelSerializer):
    """
    Serializer for retrieving basic user information without sensitive data.
    """

    class Meta:
        model = Client
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "account_type",
            "is_staff",
            "is_active",
            "is_admin",
            "is_branch_manager",
            "is_an_individual",
            "is_verified",
            "date_joined",
            "last_login",
        ]


class LoginSerializer(serializers.ModelSerializer):
    """
    Serializer for authenticating a user and retrieving relevant account details.
    """

    email = serializers.EmailField(max_length=200, min_length=5, write_only=True)
    password = serializers.CharField(max_length=200, write_only=True)
    lab = serializers.PrimaryKeyRelatedField(read_only=True, many=True)
    branch = serializers.PrimaryKeyRelatedField(read_only=True, many=True)
    hospital = serializers.PrimaryKeyRelatedField(read_only=True, many=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True, many=True)

    class Meta:
        model = Client
        fields = ["user", "email", "password", "lab", "branch", "hospital"]

    def validate(self, attrs):
        """
        Authenticate user and check verification status.
        """
        username = attrs.get("email")
        password = attrs.get("password")

        request = self.context.get("request")
        user = authenticate(request, email=username, password=password)

        if not user:
            raise AuthenticationFailed("Invalid Credentials!")
        if not user.is_verified:
            send_code_to_user(user.email)
            raise AuthenticationFailed("Unverified user. A new verification code has been sent to your email.")

        return user

    def to_representation(self, instance):
        """
        Return user details along with associated labs, branches, and hospitals.
        """
        data = super().to_representation(instance)
        data["user"] = NaiveUserSerializer(instance).data

        if instance.account_type == "Laboratory":
            data["lab"] = LaboratorySerializer(Laboratory.objects.filter(created_by=instance.id), many=True).data
            data["branch"] = BranchSerializer(
                Branch.objects.filter(Q(laboratory__created_by=instance.id) | Q(branch_manager=instance.id)), many=True
            ).data

        if instance.account_type == "Hospital":
            data["hospital"] = HospitalSerializer(Hospital.objects.filter(created_by=instance.id), many=True).data

        return data


class VerifyEmailSerializer(serializers.ModelSerializer):
    """
    Serializer for verifying email using an OTP code.
    """

    class Meta:
        model = OneTimePassword
        fields = ["code"]


class PasswordResetViewSerializer(serializers.Serializer):
    """
    Serializer for initiating a password reset request.
    Sends a reset link to the provided email if the user exists and is verified.
    """

    email = serializers.EmailField(max_length=255)

    class Meta:
        fields = ["email"]

    def validate(self, attrs):
        """
        Validate email and send password reset link if the user is verified.
        """
        email = attrs.get("email")

        if Client.objects.filter(email=email).exists():
            user = Client.objects.get(email=email)

            if not user.is_verified:
                raise AuthenticationFailed("Cannot reset password as email is not verified.")

            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)

            relative_link = reverse("user:password-reset-confirm", kwargs={"uidb64": uidb64, "token": token})
            abslink = f"https://labconnekt.com{relative_link}"
            email_body = f"Hi {user.full_name}, use the link below to reset your password: \n {abslink}"

            data = {"email_body": email_body, "email_subject": "Reset your password", "to_email": user.email}
            send_normal_email(data)
            print(abslink)

            return {"user": user, "uidb64": uidb64, "token": token}


class SetNewPasswordSerializer(serializers.Serializer):
    """
    Serializer for setting a new password after a password reset request.
    """

    password = serializers.CharField(max_length=100, min_length=8, write_only=True)
    password_confirmation = serializers.CharField(max_length=100, min_length=8, write_only=True)
    uidb64 = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True)

    class Meta:
        fields = ["password", "password_confirmation", "uidb64", "token"]

    def validate(self, attrs):
        """
        Validate reset token and ensure passwords match before updating user password.
        """
        try:
            token = attrs.get("token")
            uidb64 = attrs.get("uidb64")
            password = attrs.get("password")
            password_confirmation = attrs.get("password_confirmation")

            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = Client.objects.get(id=user_id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed("Reset link is invalid or has expired", 401)

            if password != password_confirmation:
                raise AuthenticationFailed("Passwords do not match")

            user.set_password(password)
            user.save()
            return user

        except Exception:
            raise AuthenticationFailed("An error occurred. The link may have expired or is invalid.")


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for retrieving user details along with associated labs, branches, and hospitals.
    """

    lab = serializers.PrimaryKeyRelatedField(read_only=True, many=True)
    branch = serializers.PrimaryKeyRelatedField(read_only=True, many=True)
    hospital = serializers.PrimaryKeyRelatedField(read_only=True, many=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True, many=True)

    class Meta:
        model = Client
        fields = ["user", "lab", "branch", "hospital"]

    def to_representation(self, instance):
        """
        Customize the output to include additional user-related details.
        """
        data = super().to_representation(instance)
        data["user"] = NaiveUserSerializer(instance).data

        if instance.account_type == "Laboratory":
            data["lab"] = LaboratorySerializer(Laboratory.objects.filter(created_by=instance), many=True).data
            data["branch"] = BranchSerializer(Branch.objects.filter(laboratory__created_by=instance), many=True).data

        if instance.account_type == "Hospital":
            data["hospital"] = HospitalSerializer(Hospital.objects.filter(created_by=instance), many=True).data

        return data


class NewOPTSerializer(serializers.Serializer):
    """
    Serializer for requesting a new One-Time Password (OTP) for email verification.
    """

    email = serializers.CharField(max_length=50)

    class Meta:
        fields = ["email"]