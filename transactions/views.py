from django.shortcuts import render
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, DestroyAPIView, UpdateAPIView
from .serializers import SubscriptionSerializer, TransactionSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Subscription
from .process_payment import ProcessPayments
#import json


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

	permission_classes = [IsAuthenticated]
	serializer_class = TransactionSerializer

	def post(self, request):

		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid(raise_exception=True):

			if serializer.data['payment_mode'] == 'Bank':
				return Response({'data': 'bank'}, status=status.HTTP_200_OK)

			try:
				pay = ProcessPayments(50000, 'timothysaatum@gmail.com')
				res = pay.initialize_transaction()
				print(res)

				return Response({'response': 'response'}, status=status.HTTP_200_OK)

			except ConnectionError:
				return Response({'error': 'Connection lost'}, status=status.HTTP_400_BAD_REQUEST)

			except AssertionError:
				return Response({'error': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)

			except AttributeError:
				return Response({'error': 'Object not defined'}, status=status.HTTP_404_NOT_FOUND)

			except TypeError:
				return Response({'error': 'Object is not json serializeable'}, status=status.HTTP_400_BAD_REQUEST)