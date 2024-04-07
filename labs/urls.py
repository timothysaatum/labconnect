from django.urls import path
from .views import (CreateLaboratoryView, DepartmentSerializerView, CreateTestView, CreateTestResultView,
	LaboratoryDetailView, DepartmentDetailView, TestDetailView, TestResultDetailView)


app_name = 'laboratory'
urlpatterns = [
	path('create/', CreateLaboratoryView.as_view(), name='laboratory'),
	path('department/add/', DepartmentSerializerView.as_view(), name='add-department'),
	path('test/add/', CreateTestView.as_view(), name='add-test'),
	path('test/result/add/', CreateTestResultView.as_view(), name='add-test-result'),
	path('details/<int:pk>/', LaboratoryDetailView.as_view(), name='lab-details'),
	path('department/details/<int:pk>/', DepartmentDetailView.as_view(), name='department-details'),
	path('test/details/<int:pk>/', TestDetailView.as_view(), name='test-details'),
	path('test/results/<int:pk>/', TestResultDetailView.as_view(), name='results-details'),
]