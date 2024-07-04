from django.contrib import admin
from .models import ClientProfile#, DeliveryUserProfile



class ClientProfileAdmin(admin.ModelAdmin):
	list_display = ('client', 'gender', 'id_number', 'digital_address', 'emmergency_contact', 'bio')


# class DeliveryUserProfileAdim(LabUserProfileAdim):
# 	pass



admin.site.register(ClientProfile, ClientProfileAdmin)
# admin.site.register(DeliveryUserProfile, DeliveryUserProfileAdim)