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
		'collect_sample',
		'reject_sample',
		'rejection_reason',
		'is_received_by_delivery',
		'is_delivered_to_lab',
		'is_accessed_by_lab',
		'mark_sent',
		'is_paid'
	)
	list_editable = (
		'collect_sample',
		'reject_sample',
		'is_received_by_delivery',
		'is_delivered_to_lab',
		'is_accessed_by_lab',
		'mark_sent',
		'is_paid' 
	)


admin.site.register(Sample, SampleAdmin)