from django.contrib import admin
from .models import Delivery, PriceModel


class DeliveryAdmin(admin.ModelAdmin):
	list_display = ('created_by', 'owner_phone', 'name', 'date_added', 'date_modified')


class PriceModelAdmin(admin.ModelAdmin):
	list_display = ('distance', 'price', 'date_added', 'date_modified')



admin.site.register(Delivery, DeliveryAdmin)
admin.site.register(PriceModel, PriceModelAdmin)