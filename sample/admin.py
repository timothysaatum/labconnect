from django.contrib import admin
from .models import Sample


class SampleAdmin(admin.ModelAdmin):
	list_display = (
		'patient_name',
		'patient_age',
		'sample_type', 
		'sender_phone', 
		'referring_facility', 
		'attachment', 
		'to_laboratory', 
		'is_paid'
	)


admin.site.register(Sample, SampleAdmin)