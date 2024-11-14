from django.urls import path
from .views import (
    SubscriptionCreationView,
    UpdateSubscriptionView,
    ProcessPaymentView,
    VerifyPaymentView,
    PaystackWebhookView,
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
        "webhook/paystack/",
        PaystackWebhookView.as_view(),
        name="webhook",
    ),
]
