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

	permission_classes = [IsAuthenticated]
	serializer_class = DeliverySerializer

	def post(self, request):

		serializer = self.serializer_class(data=request.data, context={'request': request})
		if serializer.is_valid(raise_exception=True):
			serializer.save(created_by=self.request.user)

		return Response({
					'message': 'Delivery created successfully.'},
					status=status.HTTP_200_OK)

	



class DeliveryListView(ListAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = DeliverySerializer

	def get_queryset(self):

		try:
			return Delivery.objects.filter(created_by=self.request.user)
			
		except Delivery.DoesNotExist:
			return Response({'error': 'Delivery not found'}, status=status.HTTP_404_NOT_FOUND)



class DeliveryDetailView(RetrieveAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = DeliverySerializer

	def get_queryset(self, pk):

		try:
			return Delivery.objects.get(pk=pk)

		except Delivery.DoesNotExist:

			return Response({'error': 'Delivery does not exist.'})

		except Exception as e:

			return Response({'error': str(e)})


	def get(self, request, pk, format=None):

		try:

			delivery = self.get_queryset(pk)
			serialized_data = DeliverySerializer(delivery)

			return Response(serialized_data.data)

		except Exception as e:
			
			return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)



class DeliveryUpdateView(UpdateAPIView):

	permission_classes = [IsAuthenticated]
	serializer_class = DeliverySerializer

	def put(self, request, pk, format=None):

		delivery = Delivery.objects.get(pk=pk)
		serializer = DeliverySerializer(delivery, data=request.data)

		if serializer.is_valid():
			if self.request.user.account_type == 'Delivery':

				serializer.save()
				return Response({'message': 'Updated'},status=status.HTTP_201_CREATED)

			return Response({'error': 'You are no authorized to edit delivery details!'},
							status=status.HTTP_401_UNAUTHORIZED)

		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class DeliveryDeleteView(DestroyAPIView):

	permission_classes = [IsAuthenticated]

	def delete(self, request, pk, format=None):

		delivery = Delivery.objects.get(pk=pk)
		if self.request.user.account_type == 'Delivery':

			delivery.delete()
			return Response({'message': 'delete successful'}, status=status.HTTP_204_NO_CONTENT)

		return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)