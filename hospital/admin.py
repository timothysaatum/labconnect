from django.contrib import admin
from .models import Hospital
from sample.models import Sample


class HospitalAdmin(admin.ModelAdmin):
	list_display = (
		'created_by',
		'name', 
		'region', 
		'postal_address', 
		'digital_address', 
		'phone', 
		'email', 
		'website', 
		'date_created', 
		'date_modified'
	)


admin.site.register(Hospital, HospitalAdmin)