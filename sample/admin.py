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
		'sample_status',
		'rejection_reason',
		'mark_sent',
		'payment_mode',
		'payment_status'
	)
	list_editable = (
		'sample_status',
		'payment_mode',
		'payment_status',
		'mark_sent' 
	)


admin.site.register(Sample, SampleAdmin)