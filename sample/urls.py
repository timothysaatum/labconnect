from django.urls import path
from .views import UpdateNotification, GetNotifications

app_name = 'sample'

urlpatterns = [
    path('update-notification/', UpdateNotification.as_view(), name='update-notification'),
    path('notifications/', GetNotifications.as_view(), name='notifications'),
]