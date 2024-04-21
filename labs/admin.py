from django.contrib import admin
from .models import Test, Department, Laboratory, TestResult
import csv
from django.http import HttpResponse



@admin.action
def download_csv(self, request, query):

	response = HttpResponse(content_type='text/csv')
	response['Content-Dispostion'] = 'attachment; filename="filename.csv"'

	writer = csv.writer(response)

	writer.writerow(['id', 'name', 'laboratory', 'price', 'current_price', 'discount_price', 
		'discount_percent', 'date_added', 'date_modified'])

	data = Test.objects.filter()

	for row in data:

		rowobj = [row.id, row.name, row.laboratory(), row.price, row.current_price(), 
		row.discount_price, row.discount_percent(), row.date_added, row.date_modified]

		writer.writerow(rowobj)

	return response



class TestAdmin(admin.ModelAdmin):
	list_display = ('id', 'name', 'laboratory', 'price', 'current_price', 'discount_price', 
		'discount_percent', 'date_added', 'date_modified')
	list_display_links = ('id', 'name')
	#list_editable = ('name', 'price', 'discount_price')
	ordering = ('id',)
	list_per_page = 10
	actions = [download_csv]


class DepartmentAdmin(admin.ModelAdmin):
	list_display = ('id', 'department_name', 'laboratory_name', 'heard_of_department', 'phone', 
		'email', 'date_added', 'date_modified')
	list_display_links = ('department_name', 'date_added', 'id')
	#list_editable = ('heard_of_department', 'phone', 'email')
	ordering = ('id',)
	list_per_page = 5


class LaboratoryAdmin(admin.ModelAdmin):
	list_display = ('id', 'created_by', 'name', 'region_of_location', 'town_of_location' ,
					'departments', 'digital_address', 'phone', 'email', 'herfra_id', 
					'website', 'date_added', 'date_modified'
					)
	list_display_links = ('created_by', 'name')
	ordering = ('id',)
	list_per_page = 5

	def departments(self, obj):
		return ", ".join([dept.department_name for dept in obj.departments.all()])



class TestResultAdmin(admin.ModelAdmin):
	list_display = ('id', 'send_by', 'department', 'laboratory', 'test', 'result', 
		'comments', 'is_verified', 'is_received' ,'date_added', 'date_modified')
	list_editable = ('is_verified', 'is_received')
	list_per_page = 5

admin.site.register(Test, TestAdmin)
admin.site.register(TestResult, TestResultAdmin)
admin.site.register(Laboratory, LaboratoryAdmin)
admin.site.register(Department, DepartmentAdmin)