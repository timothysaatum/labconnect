from django.shortcuts import render
from django.views.generic import CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Delivery
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView, RetrieveAPIView, DestroyAPIView
from .serializers import DeliverySerializer
from rest_framework.permissions import IsAuthenticated





class CreateDeliveryView(CreateAPIView):

	#permission_classes = [IsAuthenticated]
	serializer_class = DeliverySerializer

	def post(self, request):
		print(self.request.user)
		serializer = self.serializer_class(data=request.data, context={'request': request})
		if serializer.is_valid(raise_exception=True):
			serializer.save()

		return Response({
					'message': 'Delivery created successfully.'},
					status=status.HTTP_200_OK)

	