from django.contrib import admin
from .models import Test, Department, Laboratory, Branch
from .results import TestResult
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
	list_display = ('id', 'name', 'branch', 'price', 'current_price', 'discount_price', 
		'discount_percent', 'date_added', 'date_modified')
	list_display_links = ('id', 'name')
	#list_editable = ('name', 'price', 'discount_price')
	ordering = ('id',)
	list_per_page = 10
	actions = [download_csv]


class DepartmentAdmin(admin.ModelAdmin):
	list_display = ('id', 'department_name', 'branch_name', 'heard_of_department', 'phone', 
		'email', 'date_added', 'date_modified')
	list_display_links = ('department_name', 'date_added', 'id')
	#list_editable = ('heard_of_department', 'phone', 'email')
	ordering = ('id',)
	list_per_page = 10


class LaboratoryAdmin(admin.ModelAdmin):

	list_display = ('id', 'created_by', 'laboratory_name',
					'branches', 'main_phone', 'main_email', 'herfra_id', 
					'website', 'date_added', 'date_modified'
					)

	list_display_links = ('created_by', 'laboratory_name')
	ordering = ('id',)
	list_per_page = 10

	def branches(self, obj):
		return ", ".join([branch.branch_name for branch in obj.branches.all()])



class TestResultAdmin(admin.ModelAdmin):
	list_display = ('id', 'send_by', 'department', 'branch', 'test', 'result', 
		'comments', 'is_verified', 'is_received' ,'date_added', 'date_modified')
	list_editable = ('is_verified', 'is_received')
	list_per_page = 10


class BranchAdmin(admin.ModelAdmin):
	list_display = ('id', 'branch_name', 'branch_manager', 'location', 'region', 'laboratory','date_added', 'date_modified')


admin.site.register(Test, TestAdmin)
admin.site.register(Branch, BranchAdmin)
admin.site.register(TestResult, TestResultAdmin)
admin.site.register(Laboratory, LaboratoryAdmin)
admin.site.register(Department, DepartmentAdmin)