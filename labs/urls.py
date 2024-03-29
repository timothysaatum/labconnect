from django.urls import path
from .views import CreateLaboratoryView, DepartmentSerializerView, CreateTestView, CreateTestResultView


app_name = 'laboratory'
urlpatterns = [

	path('create/', CreateLaboratoryView.as_view(), name='laboratory'),
	path('department/add/', DepartmentSerializerView.as_view(), name='add-department'),
	path('test/add/', CreateTestView.as_view(), name='add-test'),
	path('test/result/add/', CreateTestResultView.as_view(), name='add-test-result'),
	#path('delete/<int:pk>/', DeleteDelivery.as_view(), name='delete-delivery'),
	
]