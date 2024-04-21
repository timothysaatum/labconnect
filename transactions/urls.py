from django.urls import path
from .views import SubscriptionCreationView, UpdateSubscriptionView, ProcessPaymentView


app_name = 'transacctions'
urlpatterns = [
	path('add-subscription/', SubscriptionCreationView.as_view(), name='subscription'),
	path('update-subscription/', UpdateSubscriptionView.as_view(), name='update-subscription'),
	path('pay/', ProcessPaymentView.as_view(), name='pay-for-service')
]