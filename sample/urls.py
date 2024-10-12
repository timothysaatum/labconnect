from django.urls import path
from .views import (
    UpdateNotification, 
    GetNotifications,
    CountObjects, 
    TrackSampleState, 
    GetTrackerDetails
)

app_name = 'sample'

urlpatterns = [
    path('update-notification/<int:noti_id>/', UpdateNotification.as_view(), name='update-notification'),
    path('notifications/<uuid:branch_id>/', GetNotifications.as_view(), name='notifications'),
    path('track-sample-state/', TrackSampleState.as_view(), name='tracking-sample'),
    path('get-sample-counts-for-facility/<uuid:facility_id>/', CountObjects.as_view(), name='counts'),
    path('get-tracker-details/<int:sample_id>/', GetTrackerDetails.as_view(), name='tracker-details')
]