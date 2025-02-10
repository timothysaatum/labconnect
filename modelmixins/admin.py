from django.contrib import admin
from .models import SampleType

# Register your models here.
class SampleTypeAdmin(admin.ModelAdmin):
	list_display = (
		'id', 
		'sample_name', 
	)
	
admin.site.register(SampleType, SampleTypeAdmin)