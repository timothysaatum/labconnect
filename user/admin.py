from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from .models import Client, OneTimePassword
from .forms import ClientCreationForm, ClientChangeForm



class ClientAdmin(UserAdmin):
    # The forms to add and change user instances
    form = ClientChangeForm
    add_form = ClientCreationForm

    list_display = ('email', 'first_name', 'middle_name', 'last_name', 'phone_number', 'is_verified')
    list_editable = ('is_verified', )
    list_filter = ('email', 'phone_number')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'middle_name', 'last_name', 'gender', 'phone_number')}),
        ('Other details', {'fields': ('digital_address', 'emmergency_number', 'staff_id','date_joined')}),
        #('Permissions', {'fields': ('is_admin', 'is_active', 'is_staff', 'is_superuser')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide', 'extrapretty'),
            'fields': ('email', 'phone_number', 'password1', 'password2', 'first_name', 'middle_name', 'last_name', 'gender', 
            'digital_address', 'emmergency_number', 'staff_id', 'has_a_lab', 'has_a_delivery', 'is_a_clinician', 'is_admin', 'is_active', 'is_staff', 'is_superuser'),
        }),
    )

    search_fields = ('email', 'last_name')
    ordering = ('email',)
    filter_horizontal = ()


class OneTimePasswordAdmin(admin.ModelAdmin):
    list_display = ('code', )


# Now register the new UserAdmin...
admin.site.register(Client, ClientAdmin)
admin.site.register(OneTimePassword, OneTimePasswordAdmin)
# ... and, since we're not using Django's built-in permissions,
# unregister the Group model from admin.
#admin.site.unregister(Group)