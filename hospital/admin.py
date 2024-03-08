from django.contrib import admin
from .models import Hospital, Ward, Sample


class HospitalAdmin(admin.ModelAdmin):
	list_display = ('name', 'created_by', 'date_created', 'date_modified')



class WardAdmin(admin.ModelAdmin):
	list_display = ('ward_type', 'ward_manager', 'phone', 'date_created', 'date_modified')



class SampleAdmin(admin.ModelAdmin):
	list_display = ('send_by', 'name_of_patient', 'sample_type', 'sender_phone', 'hospital')



admin.site.register(Hospital, HospitalAdmin)
admin.site.register(Ward, WardAdmin)
admin.site.register(Sample, SampleAdmin)