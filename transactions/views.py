from rest_framework.views import APIView
import uuid
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, DestroyAPIView, UpdateAPIView
from .serializers import SubscriptionSerializer, TransactionSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Subscription, Transaction
from .process_payment import Paystack
from django.db import IntegrityError
from decimal import Decimal

import json


class SubscriptionCreationView(CreateAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = SubscriptionSerializer

	def post(self, request):

		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid(raise_exception=True):
			
			serializer.save(subscriber=self.request.user)

		return Response(
					{'message': 'Subscription successful.'},
					status=status.HTTP_200_OK)


class UpdateSubscriptionView(UpdateAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = SubscriptionSerializer

	def put(self, request, format=None):

		subscription = Subscription.objects.get(subscriber=self.request.user)
		serializer = SubscriptionSerializer(subscription, data=request.data)

		if serializer.is_valid():
			if self.request.user.is_admin:

				serializer.save()
				return Response({'message': 'Subscription Updated'},status=status.HTTP_201_CREATED)

			return Response({'error': 'Unauthorized action.'},
							status=status.HTTP_401_UNAUTHORIZED)

		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProcessPaymentView(CreateAPIView):
	serializer_class = TransactionSerializer
	def post(self, request):

		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid(raise_exception=True):
			
			data = {
                "client_id": 1,
                "amount": Decimal(serializer.data["amount"]),
                "email": serializer.data["email"],
                "payment_mode": "Online",
                "service_paid": "Referral of Sample",
                "payment_status": "Pending",
                "reference": str(uuid.uuid4()),
            }
			for _ in range(5):
				try:
					transaction = Transaction.objects.create(**data)
				except IntegrityError:
                	# Retry if UUID collision occurs (extremely rare)
					continue
				try:
					pay = Paystack()

					response = pay.initialize_payment(
                    transaction.email,
                    transaction.amount,
                    "https://labconnect.apis.call_url",
                )
					print(response.json())

					return Response(response.json(), status=status.HTTP_201_CREATED)

            # if response['status']:
            # 	return Response(response, status=status.HTTP_200_OK)
            # else:
            # 	return Response(response, status=status.HTTP_400_BAD_REQUEST)

				except Exception as e:
					print(e)
					return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


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
        # print(response.json())
        if response["status"]:
            # If verification is successful, update payment status in the database
            try:
                payment = Transaction.objects.get(reference=reference)
                payment.status = (
                    "Completed" if response["data"]["status"] == "success" else "Pending"
                )
                payment.save()
            except Transaction.DoesNotExist:
                return Response(
                    {"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND
                )

            return Response(response, status=status.HTTP_200_OK)
        else:
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
