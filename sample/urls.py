from django.urls import path
from .views import UpdateNotification, GetNotifications,CountObjects, SendSampleView, TrackSampleState

app_name = 'sample'

urlpatterns = [
    path('update-notification/<int:noti_id>', UpdateNotification.as_view(), name='update-notification'),
    path('users/send-sample/', SendSampleView.as_view(), name='send-sample'),
    path('notifications/<uuid:branch_id>/', GetNotifications.as_view(), name='notifications'),
    path('track-sample-state/', TrackSampleState.as_view(), name='tracking-sample'),
    path('sample-stream/count/', CountObjects.as_view(), name='counts')
]