from django.contrib import admin
from .models import Sample, Notification


class SampleAdmin(admin.ModelAdmin):
	list_display = (
		'patient_name',
		'patient_age',
		# 'sample_type', 
		'sender_phone', 
		'referring_facility',
		'facility_type',
		'attachment',
		'to_laboratory', 
		'sample_status',
		'rejection_reason',
		'is_marked_sent',
		'priority'
	)
	list_editable = (
		'sample_status',
		'is_marked_sent' 
	)

class NotificationAdmin(admin.ModelAdmin):
	list_display = (
		'branch',
		'message',
		'is_read',
		'date_created',
		'date_modified'
	)

admin.site.register(Sample, SampleAdmin)
admin.site.register(Notification, NotificationAdmin)