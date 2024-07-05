from django.urls import path
from .views import (
    UpdateUserProfile,
    #UpdateDeliveryUserProfile
)

app_name = 'profiles'
urlpatterns = [
    path('labuser/profile/update/', UpdateUserProfile.as_view(), name='update-labuser-profile'),
    #path('deliveryuser/profile/update/', UpdateDeliveryUserProfile.as_view(), name='update-deliveryuser-profile'),
]