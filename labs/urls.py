from django.urls import path
from .views import CreateLaboratoryView, DepartmentSerializerView


app_name = 'laboratory'
urlpatterns = [

	path('create/', CreateLaboratoryView.as_view(), name='laboratory'),
	path('department/add/', DepartmentSerializerView.as_view(), name='add-department'),
	#path('delete/<int:pk>/', DeleteDelivery.as_view(), name='delete-delivery'),
	
]