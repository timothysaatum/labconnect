from django.urls import path
from .views import (CreateLaboratoryView, CreateTestView, CreateTestResultView,
	BranchDetailView, TestUpdateView, BranchListView, BranchUpdateView, CreateBranchView,
	BranchDeleteView, TestListView,TestDeleteView, TestResultListView, TestResultDetailView, 
	TestResultUpdateView, TestResultDeleteView, LaboratorySampleList, AllLaboratories)
from .sample_views import LaboratorySampleSerializerView



app_name = 'laboratory'
urlpatterns = [

	#creating, reading, updating and deleting laboratory routes

	path('create/', CreateLaboratoryView.as_view(), name='create-laboratory'),
	path('create-branch/', CreateBranchView.as_view(), name='create-branch'),
	path('list/', BranchListView.as_view(), name='laboratory-list'),
	path('laboratory/all/', AllLaboratories.as_view(), name='all-labs'),
	path('details/<int:pk>/', BranchDetailView.as_view(), name='branch-details'),
	path('update/<int:pk>/', BranchUpdateView.as_view(), name='branch-update'),
	path('delete/<int:pk>/', BranchDeleteView.as_view(), name='branch-delete'),


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
	path('samples-list/', LaboratorySampleList.as_view(), name='samples-list'),

	#url endpoints for creating, updating and deletion of laboratory samples
	path('laboratory/add/sample/', LaboratorySampleSerializerView.as_view(), name='samples-list')
]