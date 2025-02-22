from django.urls import path
from .views import (
    SubscriptionCreationView,
    UpdateSubscriptionView,
    ProcessPaymentView,
    VerifyPaymentView,
    PaystackWebhookView,
    FetchBanks,
    VerifyAccountView
)


app_name = 'transactions'

urlpatterns = [
    path("add-subscription/", SubscriptionCreationView.as_view(), name="subscription"),
    path(
        "update-subscription/",
        UpdateSubscriptionView.as_view(),
        name="update-subscription",
    ),
    path("pay/initialize/", ProcessPaymentView.as_view(), name="initialize-payment"),
    path(
        "verify-payment/<str:reference>/",
        VerifyPaymentView.as_view(),
        name="verify-payment",
    ),
    path(
        "paystack-webhook/",
        PaystackWebhookView.as_view(),
        name="webhook",
    ),
    path("fetch-banks-list/", FetchBanks.as_view(), name="fetch-banks"),
    path('verify-account/', VerifyAccountView.as_view(), name='verify-account'),
]
