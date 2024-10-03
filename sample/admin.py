from django.contrib import admin
from .models import Sample, Notification, SampleTrackingHistory


class SampleAdmin(admin.ModelAdmin):
	list_display = (
		'id',
		'patient_name',
		'referring_facility',
		'to_laboratory', 
		'sample_status',
		'request_status',
		'is_emmergent'
	)
	list_filter = ('sample_status', 'to_laboratory', 'referring_facility')
	list_editable = (
		# 'sample_status',
		'request_status',
	)

class NotificationAdmin(admin.ModelAdmin):
	list_display = (
		'id',
		'branch',
		'message',
		'is_read',
		'date_created',
		'date_modified'
	)

@admin.register(SampleTrackingHistory)
class SampleTrackingHistoryAdmin(admin.ModelAdmin):
    list_display = ('sample', 'status', 'location', 'updated_at')

admin.site.register(Sample, SampleAdmin)
admin.site.register(Notification, NotificationAdmin)