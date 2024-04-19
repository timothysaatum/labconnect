from django.urls import path
from .views import SubscriptionCreationView, UpdateSubscriptionView


app_name = 'transacctions'
urlpatterns = [
	path('add-subscription/', SubscriptionCreationView.as_view(), name='subscription'),
	path('update-subscription/', UpdateSubscriptionView.as_view(), name='update-subscription')
]