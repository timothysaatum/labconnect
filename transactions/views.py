from rest_framework.views import APIView
import uuid
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView
from .serializers import SubscriptionSerializer, TransactionSerializer, BankSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Subscription, Transaction, Bank
from .process_payment import Paystack
from django.db import IntegrityError
from decimal import Decimal
import hashlib
import hmac
from django.conf import settings
import json


class SubscriptionCreationView(CreateAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer

    def post(self, request):

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):

            serializer.save(subscriber=self.request.user)

        return Response(
            {"message": "Subscription successful."}, status=status.HTTP_200_OK
        )


class UpdateSubscriptionView(UpdateAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer

    def put(self, request, format=None):

        subscription = Subscription.objects.get(subscriber=self.request.user)
        serializer = SubscriptionSerializer(subscription, data=request.data)

        if serializer.is_valid():
            if self.request.user.is_admin:

                serializer.save()
                return Response(
                    {"message": "Subscription Updated"}, status=status.HTTP_201_CREATED
                )

            return Response(
                {"error": "Unauthorized action."}, status=status.HTTP_401_UNAUTHORIZED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProcessPaymentView(CreateAPIView):

    # permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer

    def post(self, request):

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):

            data = {
                "client_id": self.request.user.id,
                "referral_id": serializer.data["referral"],
                "amount": Decimal(serializer.data["amount"]),
                "channels": serializer.data["channels"],
                "email": serializer.data["email"],
                "payment_mode": "Online",
                "payment_status": "Pending",
                "reference": str(uuid.uuid4()),
            }

            for _ in range(5):
                try:
                    transaction = Transaction.objects.create(**data)
                except IntegrityError:
                    # Retry if UUID collision occurs
                    continue
                try:
                    pay = Paystack()

                    response = pay.initialize_payment(
                        transaction.email,
                        transaction.amount,
                        "https://api.labconnekt.com/call_url",
                        transaction.reference,
                        transaction.channels,
                    )

                    return Response(response.json(), status=status.HTTP_201_CREATED)

                except Exception as e:

                    return Response(
                        {"error": str(e)}, status=status.HTTP_400_BAD_REQUEST
                    )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyPaymentView(APIView):
    def post(self, request, *args, **kwargs):
        # Retrieve the reference from the request data
        reference = self.kwargs.get("reference")
        if not reference:
            return Response(
                {"error": "Reference is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        paystack = Paystack()
        response = paystack.verify_payment(reference).json()

        if response["status"]:
            # If verification is successful, update transaction status in the database
            try:
                transaction = Transaction.objects.get(reference=reference)
                transaction.status = (
                    "Completed"
                    if response["data"]["status"] == "success"
                    else "Pending"
                )
                transaction.is_verified = True
                # Save the transaction changes to the database
                transaction.save()
            
                referral = transaction.referral
                referral.is_completed = True
                referral.save()

            except Transaction.DoesNotExist:
                return Response(
                    {"error": "Transaction not found"}, status=status.HTTP_404_NOT_FOUND
                )

            return Response(
                {"status": response["status"], "message": response["message"]},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(response, status=status.HTTP_400_BAD_REQUEST)


class PaystackWebhookView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):

        secret_key = settings.PAYSTACK_SECRET

        # Get the signature from headers
        signature = request.headers.get("X-Paystack-Signature")

        if not signature:
            return Response(
                {"error": "Missing signature"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Get the payload
        payload = request.body

        # Verify the signature
        expected_signature = hmac.new(
            secret_key.encode(), payload, hashlib.sha512
        ).hexdigest()
        if signature != expected_signature:
            return Response(
                {"error": "Invalid Signature"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Parse the webhook payload
        event = json.loads(payload)

        if event["event"] == "charge.success":
            try:
                # Extract transaction reference from the event data
                reference = event["data"]["reference"]
                # Find the transaction in the database
                transaction = Transaction.objects.filter(reference=reference).first()

                # Update the transaction status
                transaction.payment_status = "Completed"
                transaction.is_verified = True
                transaction.save()

                referral = transaction.referral
                referral.is_completed = True
                referral.save()

                # Log the successful update
                print(f"Transaction {reference} updated to Payment Successful.")

            except Transaction.DoesNotExist:
                # Handle cases where the transaction does not exist
                return Response(
                    {"error": "Transaction not found"}, status=status.HTTP_404_NOT_FOUND
                )

        # Acknowledge receipt of the webhook
        return Response(
            {"message": "Webhook received and processed"}, status=status.HTTP_200_OK
        )


class FetchBanks(ListAPIView):
    serializer_class = BankSerializer
    queryset = Bank.objects.all()