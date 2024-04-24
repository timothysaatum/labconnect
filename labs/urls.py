from django.urls import path
from .views import (CreateLaboratoryView, DepartmentSerializerView, CreateTestView, CreateTestResultView,
	LaboratoryDetailView, DepartmentDetailView, TestUpdateView, DepartmentDetailView,
	LaboratoryListView, LaboratoryUpdateView, LaboratoryDeleteView, DepartmentListView, DepartmentUpdateView,
	DepartmentDeleteView, TestListView,TestDeleteView, TestResultListView, TestResultDetailView, TestResultUpdateView,
	TestResultDeleteView, LaboratorySampleList, AllLaboratories)


app_name = 'laboratory'
urlpatterns = [

	#creating, reading, updating and deleting laboratory routes

	path('create/', CreateLaboratoryView.as_view(), name='create-laboratory'),
	path('list/', LaboratoryListView.as_view(), name='laboratory-list'),
	path('laboratories/all/', AllLaboratories.as_view(), name='all-laboratories'),
	path('details/<int:pk>/', LaboratoryDetailView.as_view(), name='laboratory-details'),
	path('update/<int:pk>/', LaboratoryUpdateView.as_view(), name='laboratory-update'),
	path('delete/<int:pk>/', LaboratoryDeleteView.as_view(), name='laboratory-delete'),


	#creating, reading, updating and deleting department routes

	path('department/add/', DepartmentSerializerView.as_view(), name='add-department'),
	path('department/list/', DepartmentListView.as_view(), name='list-departments'),
	path('department/details/<int:pk>/', DepartmentDetailView.as_view(), name='department-details'),
	path('department/update/<int:pk>/', DepartmentUpdateView.as_view(), name='department-update'),
	path('department/delete/<int:pk>/', DepartmentDeleteView.as_view(), name='department-delete'),
	
	#creating, reading, updating and deleting test & results routes

	path('test/add/', CreateTestView.as_view(), name='add-test'),
	path('test/list/<int:pk>/', TestListView.as_view(), name='test-list'),
	path('test/update/<int:pk>/', TestUpdateView.as_view(), name='test-update'),
	path('test/delete/<int:pk>/', TestDeleteView.as_view(), name='test-delete'),
	path('test/result/add/', CreateTestResultView.as_view(), name='add-test-result'),
	path('test/result/list/', TestResultListView.as_view(), name='results-list'),
	path('test/result/details/<int:pk>/', TestResultDetailView.as_view(), name='results-details'),
	path('test/result/update/<int:pk>/', TestResultUpdateView.as_view(), name='result-update'),
	path('test/result/delete/<int:pk>/', TestResultDeleteView.as_view(), name='result-delete'),


	#samples
	path('samples-list/', LaboratorySampleList.as_view(), name='samples-list')
]