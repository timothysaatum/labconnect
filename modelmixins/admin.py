from django.contrib import admin
from .models import (
    SampleType, 
    FacilityWorkingHours, 
    TestTemplate,
    SampleTypeTemplate,
    Department
    )

# Register your models here.
class SampleTypeAdmin(admin.ModelAdmin):
	list_display = (
		'id', 
		'sample_name', 
	)
	

class SampleTypeTemplateAdmin(SampleTypeAdmin):
	pass


class FacilityWorkingHoursAdmin(admin.ModelAdmin):
	list_display = (
		'id', 
		"facility",
		'day', 
		"start_time",
		"end_time"
	)


class TestTemplateAdmin(admin.ModelAdmin):
	list_display = (
		'id', 
		'test_code', 
		'name',
		'price', 
		'turn_around_time', 
		'patient_preparation',
		'test_status',
		'date_added', 
		'date_modified'
	)

	
class DepartmentAdmin(admin.ModelAdmin):
	list_display = (
		'id', 
		"name",
		"branch",
	)	
	
admin.site.register(SampleType, SampleTypeAdmin)
admin.site.register(Department, DepartmentAdmin)
admin.site.register(SampleTypeTemplate, SampleTypeTemplateAdmin)
admin.site.register(FacilityWorkingHours, FacilityWorkingHoursAdmin)
admin.site.register(TestTemplate, TestTemplateAdmin)