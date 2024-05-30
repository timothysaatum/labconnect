from django.contrib import admin
from .models import LabUserProfile, DeliveryUserProfile



class LabUserProfileAdim(admin.ModelAdmin):
	list_display = ('client', 'gender', 'id_number', 'digital_address', 'emmergency_contact', 'bio')


class DeliveryUserProfileAdim(LabUserProfileAdim):
	pass



admin.site.register(LabUserProfile, LabUserProfileAdim)
admin.site.register(DeliveryUserProfile, DeliveryUserProfileAdim)