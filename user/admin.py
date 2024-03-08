from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from .models import Client
from .forms import ClientCreationForm, ClientChangeForm



class ClientAdmin(UserAdmin):
    # The forms to add and change user instances
    form = ClientChangeForm
    add_form = ClientCreationForm

    list_display = ('email', 'first_name', 'middle_name', 'last_name', 'phone_number')
    list_filter = ('email', 'phone_number')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'middle_name', 'last_name', 'gender', 'phone_number')}),
        ('Other details', {'fields': ('digital_address', 'emmergency_number', 'staff_id','date_joined')}),
        ('Permissions', {'fields': ('is_admin', 'is_active', 'is_staff', 'has_lab')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide', 'extrapretty'),
            'fields': ('email', 'phone_number', 'password1', 'password2'),
        }),
    )
    search_fields = ('email', 'last_name')
    ordering = ('email',)
    filter_horizontal = ()


# Now register the new UserAdmin...
admin.site.register(Client, ClientAdmin)
# ... and, since we're not using Django's built-in permissions,
# unregister the Group model from admin.
admin.site.unregister(Group)