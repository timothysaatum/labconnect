from .models import Delivery, PriceModel
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from .serializers import DeliverySerializer, PriceModelSerializer
from rest_framework.permissions import IsAuthenticated, BasePermission


class DeliveryPermissionMixin(BasePermission):
	permission_classes = [IsAuthenticated]

	def has_permission(self, request, view):
		return request.user.is_authenticated and request.user.account_type == 'Delivery'


class DeliveryMixin(generics.GenericAPIView):
	'''Mixins class for common logic in sample views'''

	permission_classes = [DeliveryPermissionMixin]
	serializer_class = DeliverySerializer

	def get_queryset(self):
		return Delivery.objects.filter(created_by=self.request.user)


class CreateDeliveryView(DeliveryMixin, generics.CreateAPIView):

	def post(self, request):
		
		return self.create(request)

	def perform_create(self, serializer):
		serializer.save(created_by=self.request.user)


class DeliveryListView(DeliveryMixin, generics.ListAPIView):
	pass


class DeliveryDetailView(generics.RetrieveAPIView):
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


class DeliveryUpdateView(DeliveryMixin, generics.UpdateAPIView):

	def put(self, request, pk, format=None):
		
		return super().put(request, pk, format=None)


class DeliveryDeleteView(DeliveryMixin, generics.DestroyAPIView):

	def delete(self, request, pk, format=None):

		return super().delete(request, pk, format=None)
		

class AllDelivery(generics.ListAPIView):

	serializer_class = DeliverySerializer

	def get_queryset(self):

		return Delivery.objects.all()

	def get(self, request, *args, **kwargs):
		try:
			delivery = self.get_queryset()
			serializer = self.get_serializer(delivery, many=True)
			return Response(serializer.data)
		
		except Delivery.DoesNotExist:
			return Response({'error': 'Not found'},status=status.HTTP_404_NOT_FOUND)


class CreatePriceModelView(DeliveryMixin, generics.CreateAPIView):
	serializer_class = PriceModelSerializer

	def post(self, request):

		return self.create(request)


class UpdatePriceModelView(DeliveryMixin, generics.UpdateAPIView):
	serializer_class = PriceModelSerializer

	def get_queryset(self):
		return PriceModel.objects.filter(pk=self.kwargs.get('pk'))

	def put(self, request, pk, format=None):
		
		return super().put(request, pk, format=None)


class DeletePriceModelView(DeliveryMixin, generics.DestroyAPIView):

	def get_queryset(self):
		return PriceModel.objects.filter(pk=self.kwargs.get('pk'))

	def delete(self, request, pk, format=None):

		return super().delete(request, pk, format=None)


class PriceModels(generics.ListAPIView):

	serializer_class = PriceModelSerializer

	def get_queryset(self):

		return PriceModel.objects.all()

	def get(self, request, *args, **kwargs):

		try:
			price = self.get_queryset()
			serializer = self.get_serializer(price, many=True)
			return Response(serializer.data)

		except PriceModel.DoesNotExist:
			return Response({'error': 'Not found'},status=status.HTTP_404_NOT_FOUND)