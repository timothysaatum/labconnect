from .models import Delivery
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import (
	CreateAPIView,
	UpdateAPIView,
	ListAPIView,
	RetrieveAPIView, 
	DestroyAPIView, 
	GenericAPIView
)
from .serializers import DeliverySerializer
from rest_framework.permissions import IsAuthenticated, BasePermission


class DeliveryPermissionMixin(BasePermission):
	permission_classes = [IsAuthenticated]

	def has_permission(self, request, view):
		return (
				request.user.is_authenticated and (
				request.user.account_type == 'Delivery'
			)
		)


class DeliveryMixin(GenericAPIView):
	'''Mixins class for common logic in sample views'''

	permission_classes = [DeliveryPermissionMixin]
	serializer_class = DeliverySerializer

	def get_queryset(self):
		return Delivery.objects.filter(created_by=self.request.user)


class CreateDeliveryView(DeliveryMixin, CreateAPIView):

	def post(self, request):

		if not self.get_permissions():
			return Response({'error': 'Unauthroized action'}, status=status.HTTP_400_BAD_REQUEST)

		self.create(request)
		return Response({'message': 'Created'}, status=status.HTTP_201_CREATED)

	def perform_create(self, serializer):
		serializer.save(created_by=self.request.user)


class DeliveryListView(DeliveryMixin, ListAPIView):
	pass


class DeliveryDetailView(RetrieveAPIView):
	serializer_class = DeliverySerializer

	def get_queryset(self, pk):

		return Delivery.objects.get(pk=pk)

	def get(self, request, pk, format=None):

		try:
			delivery = self.get_queryset(pk=pk)
			serialized_data = DeliverySerializer(delivery)
			return Response(serialized_data.data)

		except Delivery.DoesNotExist:
			return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


class DeliveryUpdateView(DeliveryMixin, UpdateAPIView):

	def put(self, request, pk, format=None):
		
		if not self.get_permissions():

			return Response({'error': 'You are not authorized to perform this action'}, status=status.HTTP_401_UNAUTHORIZED)

		self.update(request, pk, format=None)
		return Response({'message': 'Updated'}, status=status.HTTP_200_OK)


class DeliveryDeleteView(DeliveryMixin, DestroyAPIView):

	def delete(self, request, pk, format=None):

		if not self.get_permissions():

			return Response({'error': 'You are not authorized to perform this action'}, status=status.HTTP_401_UNAUTHORIZED)
		
		self.destroy(request, pk, format=None)
		return Response({'message': 'Delete successful.'}, status=status.HTTP_204_NO_CONTENT)


class AllDelivery(ListAPIView):

	serializer_class = DeliverySerializer

	def get_queryset(self):

		try:
			return Delivery.objects.all()
			
		except Delivery.DoesNotExist:
			return Response({'error': 'Delivery not found'}, status=status.HTTP_404_NOT_FOUND)

