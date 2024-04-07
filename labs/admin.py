from django.contrib import admin
from .models import Test, Department, Laboratory

class TestAdmin(admin.ModelAdmin):
	list_display = ('id', 'name', 'laboratory', 'price', 'current_price', 'discount_price', 'discount_percent', 'date_added', 'date_modified')
	list_display_links = ('id', 'name')
	#list_editable = ('name', 'price', 'discount_price')
	ordering = ('id',)


class DepartmentAdmin(admin.ModelAdmin):
	list_display = ('id', 'department_name', 'laboratory_name', 'heard_of_department', 'phone', 'email', 'tests', 'date_added', 'date_modified')
	list_display_links = ('department_name', 'date_added', 'id')
	#list_editable = ('heard_of_department', 'phone', 'email')
	ordering = ('id',)


class LaboratoryAdmin(admin.ModelAdmin):
	list_display = ('id', 'created_by', 'name', 'departments', 'digital_address', 'phone', 'email', 'herfra_id', 
		'website', 'date_added', 'date_modified')
	list_display_links = ('created_by', 'name')
	ordering = ('id',)


admin.site.register(Test, TestAdmin)
admin.site.register(Laboratory, LaboratoryAdmin)
admin.site.register(Department, DepartmentAdmin)