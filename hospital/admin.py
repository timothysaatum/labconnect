from django.contrib import admin
from .models import Hospital, Sample


class HospitalAdmin(admin.ModelAdmin):
	list_display = ('name', 'region_of_location', 'mailing_address', 'digital_address', 
		'phone', 'email', 'website', 'date_created', 'date_modified')


class SampleAdmin(admin.ModelAdmin):
	list_display = ('send_by', 'name_of_patient', 'sample_type', 'sender_phone', 'hospital', 
		'delivery', 'delivery_phone', 'is_paid')



admin.site.register(Hospital, HospitalAdmin)
admin.site.register(Sample, SampleAdmin)