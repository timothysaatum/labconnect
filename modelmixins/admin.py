from django.contrib import admin
from .models import SampleType, FacilityWorkingHours

# Register your models here.
class SampleTypeAdmin(admin.ModelAdmin):
	list_display = (
		'id', 
		'sample_name', 
	)


class FacilityWorkingHoursAdmin(admin.ModelAdmin):
	list_display = (
		'id', 
		"facility",
		'day', 
		"start_time",
		"end_time"
	)

admin.site.register(SampleType, SampleTypeAdmin)
admin.site.register(FacilityWorkingHours, FacilityWorkingHoursAdmin)