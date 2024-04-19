from django.shortcuts import render
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, DestroyAPIView, UpdateAPIView
from .serializers import SubscriptionSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Subscription


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

			return Response({'error': 'You are no authorized to edit subscription details!'},
							status=status.HTTP_401_UNAUTHORIZED)

		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)