from django.urls import path
from .views import SubscriptionCreationView


app_name = 'transacctions'
urlpatterns = [
	path('add-suscription/', SubscriptionCreationView.as_view(), name='subscription')
]