from django.contrib import admin
from .models import Plan, Subscription, Incentive



class PlanAdmin(admin.ModelAdmin):
	list_display = ('name', 'duration', 'price')


class SubscriptionAdmin(admin.ModelAdmin):
	list_display = ('plan', 'subscriber', 'is_renewed', 'is_cancelled', 'is_paid', 'has_expired', 'date_of_subscription')


class IncentiveAdmin(admin.ModelAdmin):
	list_display = ('beneficient', 'email', 'tel', 'number_of_requests', 'amortized_amount', 
		'is_withdrawn', 'balance', 'emmergency_contact', 'date_withdrawn')


admin.site.register(Plan, PlanAdmin)
admin.site.register(Subscription, SubscriptionAdmin)
admin.site.register(Incentive, IncentiveAdmin)