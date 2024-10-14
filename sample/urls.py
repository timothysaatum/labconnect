from django.urls import path
from .views import (
    UpdateNotification,
    GetNotifications,
    CountObjects,
    TrackSampleState,
    GetTrackerDetails,
    CreateReferral,
    UpdateReferral,
    GetReferrals,
    UpdateSample,
)

app_name = 'sample'

urlpatterns = [
    path(
        "update-notification/<int:noti_id>",
        UpdateNotification.as_view(),
        name="update-notification",
    ),
    path(
        "notifications/<uuid:branch_id>/",
        GetNotifications.as_view(),
        name="notifications",
    ),
    path("track-sample-state/", TrackSampleState.as_view(), name="tracking-sample"),
    path(
        "get-sample-counts-for-facility/<uuid:facility_id>/",
        CountObjects.as_view(),
        name="counts",
    ),
    path(
        "get-tracker-details/<int:sample_id>/",
        GetTrackerDetails.as_view(),
        name="tracker-details",
    ),
    path("create-referral/", CreateReferral.as_view(), name="create-referral"),
    path(
        "update-referral/<uuid:referral_id>/",
        UpdateReferral.as_view(),
        name="update-referral",
    ),
    path(
        "get-referrals/<uuid:facility_id>/", GetReferrals.as_view(), name="get-referral"
    ),
    path(
        "update-sample/<int:pk>/",
        UpdateSample.as_view(),
        name="update-sample",
    )
]
