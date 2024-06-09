from django.contrib import admin
from .models import Sample


class SampleAdmin(admin.ModelAdmin):
	list_display = (
		'patient_name',
		'patient_age',
		'sample_type', 
		'sender_phone', 
		'referring_facility',
		'facility_type',
		'attachment', 
		'to_laboratory', 
		'status',
		'is_paid'
	)


admin.site.register(Sample, SampleAdmin)