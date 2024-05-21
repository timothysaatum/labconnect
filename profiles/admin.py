from django.contrib import admin
from .models import HealthWorkerProfile, LabUserProfile, DeliveryUserProfile


class HealthWorkerProfileAdmin(admin.ModelAdmin):
	list_display = ('client', 'gender', 'id_number', 'digital_address', 'emmergency_contact', 'bio')

class LabUserProfileAdim(HealthWorkerProfileAdmin):
	pass


class DeliveryUserProfileAdim(HealthWorkerProfileAdmin):
	pass


admin.site.register(HealthWorkerProfile, HealthWorkerProfileAdmin)
admin.site.register(LabUserProfile, LabUserProfileAdim)
admin.site.register(DeliveryUserProfile, DeliveryUserProfileAdim)