from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Permission
from .models import Client, OneTimePassword
from .forms import ClientCreationForm, ClientChangeForm




class ClientAdmin(UserAdmin):
    # The forms to add and change user instances
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
        ('Permissions', {'fields': ('is_admin', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions', 'is_branch_manager')}),
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


# Now register the new UserAdmin...
admin.site.register(Client, ClientAdmin)
admin.site.register(OneTimePassword, OneTimePasswordAdmin)
admin.site.register(Permission)