from django.urls import path
from .views import UpdateNotification, GetNotifications,CountObjects, SendSampleView

app_name = 'sample'

urlpatterns = [
    path('update-notification/', UpdateNotification.as_view(), name='update-notification'),
    path('users/send-sample/', SendSampleView.as_view(), name='send-sample'),
    path('notifications/', GetNotifications.as_view(), name='notifications'),
    path('sample-stream/count/', CountObjects.as_view(), name='counts')
]