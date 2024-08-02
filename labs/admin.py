from django.contrib import admin
from .models import (
		Test,
		Laboratory, 
		Branch, 
		BranchManagerInvitation,
		SampleType,
		BranchTest,
		Result
	)
# from .results import TestResult
import csv
from django.http import HttpResponse



@admin.action
def download_csv(self, request, query):

	response = HttpResponse(content_type='text/csv')
	response['Content-Dispostion'] = 'attachment; filename="filename.csv"'

	writer = csv.writer(response)

	writer.writerow(['id', 'name', 'laboratory', 'price', 'date_added', 'date_modified'])

	data = Test.objects.filter()

	for row in data:

		rowobj = [row.id, row.name, row.laboratory(), row.price, row.date_added, row.date_modified]

		writer.writerow(rowobj)

	return response

class BranchTestInline(admin.TabularInline):
	model = BranchTest
	extra = 1

class TestAdmin(admin.ModelAdmin):
	list_display = (
		'id', 
		'test_code', 
		'name',
		'laboratory',
		'price', 
		'turn_around_time', 
		'patient_preparation',
		'test_status',
		'date_added', 
		'date_modified'
	)
	inlines = (BranchTestInline,)
	list_display_links = ('id',)
	ordering = ('id',)
	list_per_page = 10
	actions = [download_csv]


class BranchTestAdmin(admin.ModelAdmin):
	list_display = (
		'branch',
		'test',
		'price', 
		'turn_around_time', 
		'discount_price',
		'discount_percent',
		'test_status',
	)

class SampleTypeAdmin(admin.ModelAdmin):
	list_display = (
		'id', 
		'sample_name', 
	)


class LaboratoryAdmin(admin.ModelAdmin):

	list_display = (
		'id', 
		'created_by', 
		'name',
		'branches', 
		'main_phone', 
		'main_email', 
		'herfra_id', 
		'website', 
		'date_created', 
		'date_modified'
	)

	list_display_links = (
		'id',
	)
	ordering = ('id',)
	list_per_page = 10

	def branches(self, obj):
		return ", ".join([branch.name for branch in obj.branches.all()])



class ResultAdmin(admin.ModelAdmin):

	list_display = (
		'id', 
		'send_by', 
		'branch', 
		'test', 
		'result', 
		'comments', 
		'is_verified', 
		'is_received',
		'date_added', 
		'date_modified'
	)

	list_editable = (
		'is_verified', 
		'is_received'
	)

	list_per_page = 10


class BranchAdmin(admin.ModelAdmin):
	list_display = (
		'id',  
		'branch_manager', 
		'town', 
		'region', 
		'laboratory',
		'date_created', 
		'date_modified'
	)



class BranchManagerInvitationAdmin(admin.ModelAdmin):
    list_display = ('invitation_code', 'sender', 'receiver_email', 'branch', 'used')


admin.site.register(SampleType, SampleTypeAdmin)
admin.site.register(Test, TestAdmin)
admin.site.register(Branch, BranchAdmin)
admin.site.register(BranchManagerInvitation, BranchManagerInvitationAdmin)
admin.site.register(Result, ResultAdmin)
admin.site.register(Laboratory, LaboratoryAdmin)
admin.site.register(BranchTest, BranchTestAdmin)