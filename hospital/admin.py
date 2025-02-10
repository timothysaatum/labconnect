from django.contrib import admin
from .models import Hospital, HospitalLab, HospitalLabTest


class HospitalAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "created_by",
        "name",
        "region",
        "account_number",
		"bank_name",
		"bank_code",
		"subaccount_id",
        "digital_address",
        "phone",
        "email",
        "website",
        "date_added",
        "date_modified",
    )


class HospitalLabAdmin(admin.ModelAdmin):
	list_display = (
		'id',
		'phone', 
		'email',
		'facility_type',
		"account_number",
		"bank_name",
		"bank_code",
		"subaccount_id",
		'date_added', 
		'date_modified'
	)

class HospitalTestAdmin(admin.ModelAdmin):
	list_display = (
		'id', 
		'test_code', 
		'name',
		'hospital_lab',
		'price', 
		'turn_around_time', 
		'patient_preparation',
		'test_status',
		'date_added', 
		'date_modified'
	)

admin.site.register(Hospital, HospitalAdmin)
admin.site.register(HospitalLabTest, HospitalTestAdmin)
admin.site.register(HospitalLab, HospitalLabAdmin)
