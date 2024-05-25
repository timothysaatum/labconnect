from django.urls import path
from .views import (
    UpdateHealthWorkerProfile,
    UpdateLabUserProfile,
    UpdateDeliveryUserProfile
)

app_name = 'profiles'
urlpatterns = [
    path('health-worker/profile/update/', UpdateHealthWorkerProfile.as_view(), name='update-health-worker-profile'),
    path('health-worker/profile/update/', UpdateLabUserProfile.as_view(), name='update-labuser-profile'),
    path('deliveryuser/profile/update/', UpdateDeliveryUserProfile.as_view(), name='update-deliveryuser-profile'),
]