from django.urls import path
from .views import CreateDeliveryView #DeliveryUpdate, DeleteDelivery


app_name = 'delivery'
urlpatterns = [

	path('create/', CreateDeliveryView.as_view(), name='delivery'),
	#path('edit/<int:pk>/', DeliveryUpdate.as_view(), name='edit-delivery'),
	#path('delete/<int:pk>/', DeleteDelivery.as_view(), name='delete-delivery'),
	
]