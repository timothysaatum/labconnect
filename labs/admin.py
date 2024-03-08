from django.contrib import admin
from .models import Test

class TestAdmin(admin.ModelAdmin):
	list_display = ('name', 'created_by', 'date_added', 'date_modified')


admin.site.register(Test, TestAdmin)