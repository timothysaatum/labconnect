from django.contrib import admin
from .models import Delivery


class DeliveryAdmin(admin.ModelAdmin):
	list_display = ('created_by', 'delivery_phone', 'name', 'date_added', 'date_modified')


admin.site.register(Delivery, DeliveryAdmin)
