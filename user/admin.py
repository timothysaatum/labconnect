from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Permission
from .models import Client, OneTimePassword, Complaint, WaitList, CustomerSupport
from .forms import ClientCreationForm, ClientChangeForm
import csv
from django.utils import timezone
from django.http import HttpResponse
from .admin_actions import (
    mark_as_contacted, 
    export_as_csv, 
    email_selected_participants
)




class ClientAdmin(UserAdmin):

    form = ClientChangeForm
    add_form = ClientCreationForm

    list_display = (
        'email', 
        'first_name', 
        'last_name', 
        'phone_number', 
        'account_type', 
        'is_verified', 
        'date_joined', 
        'last_login'
    )

    list_editable = ('is_verified', )
    list_filter = ('email', 'phone_number', 'account_type')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'phone_number')}),
        ('Account Type', {'fields': ('account_type',)}),
        ('Permissions', {'fields': ('is_admin', 'is_active', 'is_staff', 'is_worker', 'is_superuser', 'groups', 'user_permissions', 'is_branch_manager')}),
        ('Important Dates', {'fields': ('date_joined',)})
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide', 'extrapretty'),
            'fields': ('first_name', 'last_name', 'phone_number', 'email', 
                'account_type','password1', 'password2', 'is_admin', 'is_active', 
                'is_staff'
                ),
        }),
    )

    search_fields = ('email', 'last_name')
    ordering = ('email',)


class OneTimePasswordAdmin(admin.ModelAdmin):
    list_display = ('code', 'user', 'email_for')

@admin.register(WaitList)
class WaitListAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone_number', 'facility_name', 'region', 'contacted', 'contacted_at')
    list_filter = ('contacted', 'region')
    search_fields = ('full_name', 'email', 'phone_number', 'facility_name')
    readonly_fields = ('contacted_at',)
    actions = [
        mark_as_contacted,  # Mark selected as contacted
        export_as_csv,      # Export selected to CSV
        email_selected_participants  # Send emails to selected
    ]

    def mark_as_contacted(self, request, queryset):
        updated_count = queryset.update(contacted=True, contacted_at=timezone.now())
        self.message_user(request, f"{updated_count} entries marked as contacted.")
    mark_as_contacted.short_description = "Mark selected as contacted"


def export_as_csv(modeladmin, request, queryset):
    meta = modeladmin.model._meta
    field_names = [field.name for field in meta.fields]

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename={meta}.csv'
    writer = csv.writer(response)

    writer.writerow(field_names)
    for obj in queryset:
        writer.writerow([getattr(obj, field) for field in field_names])

    return response

export_as_csv.short_description = "Export Selected as CSV"

@admin.register(CustomerSupport)
class CustomerSupportMessageAdmin(admin.ModelAdmin):
    list_display = ('client', 'subject', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    actions = [export_as_csv]


@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):

    list_display = ('customer', 'subject', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__email', 'subject', 'message')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

    list_editable = ('status',)


admin.site.register(Client, ClientAdmin)
admin.site.register(OneTimePassword, OneTimePasswordAdmin)
admin.site.register(Permission)