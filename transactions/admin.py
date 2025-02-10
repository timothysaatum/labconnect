from django.contrib import admin
from .models import Plan, Subscription, Incentive, Transaction, Bank


class PlanAdmin(admin.ModelAdmin):
    list_display = ("name", "duration", "price", "date_added")


class SubscriptionAdmin(admin.ModelAdmin):
    list_display = (
        "plan",
        "subscriber",
        "price",
        "balance",
        "is_renewed",
        "is_cancelled",
        "is_paid",
        "has_expired",
        "date_of_subscription",
    )


class IncentiveAdmin(admin.ModelAdmin):
    list_display = (
        "beneficient",
        "email",
        "tel",
        "number_of_requests",
        "amortized_amount",
        "is_withdrawn",
        "balance",
        "emmergency_contact",
        "date_withdrawn",
    )


class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        "client",
        "amount",
        "is_verified",
        "payment_mode",
        "referral",
        "account_type",
        "email",
        "tel",
        "updated_at",
    )

@admin.register(Bank)
class BankAdmin(admin.ModelAdmin):
    list_display = ("bank_name", "code", "updated_at")

admin.site.register(Plan, PlanAdmin)
admin.site.register(Subscription, SubscriptionAdmin)
admin.site.register(Incentive, IncentiveAdmin)
admin.site.register(Transaction, TransactionAdmin)
