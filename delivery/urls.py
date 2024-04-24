from django.urls import path
from .views import (CreateDeliveryView, DeliveryListView, DeliveryDetailView, 
	DeliveryUpdateView, DeliveryDeleteView, AllDelivery)


app_name = 'delivery'
urlpatterns = [

	path('create/', CreateDeliveryView.as_view(), name='delivery'),
	path('list/', DeliveryListView.as_view(), name='delivery-list'),
	path('details/<int:pk>/', DeliveryDetailView.as_view(), name='delivery-details'),
	path('update/<int:pk>/', DeliveryUpdateView.as_view(), name='delivery-update'),
	path('delete/<int:pk>/', DeliveryDeleteView.as_view(), name='delivery-sample'),
	path('delivery/all/', AllDelivery.as_view(), name='all-deliveries'),
	
]