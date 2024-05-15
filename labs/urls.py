from django.urls import path
from .views import (
    CreateLaboratoryView,
    LaboratoryUserListVIew,
    CreateTestView, 
    CreateTestResultView,
	BranchDetailView, 
    TestUpdateView, 
    BranchListView, 
    BranchUpdateView, 
    CreateBranchView,
	BranchDeleteView, 
    TestListView,
    TestDeleteView, 
    TestResultListView, 
    TestResultDetailView, 
	TestResultUpdateView,
    TestResultDeleteView, 
    LaboratorySampleList,
    AllLaboratories, 
    LaboratorySampleSerializerView,
    LaboratorySampleUpdateView,
    LaboratorySampleDeleteView,
    HospitalSamplesView,
    LaboratoryViewSet
)


app_name = 'laboratory'
urlpatterns = [

	#creating, reading, updating and deleting laboratory
	path('create/', LaboratoryViewSet.as_view({'get': 'list', 'post': 'create'}), name='laboratory'),
	path('user-laboratory/', LaboratoryUserListVIew.as_view(), name='user-lab'),

	#creating, reading, updating and deleting Branch
	path('create-branch/', CreateBranchView.as_view(), name='create-branch'),
	path('branch/list/', BranchListView.as_view(), name='laboratory-list'),
	path('branch/all/', AllLaboratories.as_view(), name='all-labs'),
	path('branch/details/<uuid:pk>/', BranchDetailView.as_view(), name='branch-details'),
	path('branch/update/<uuid:pk>/', BranchUpdateView.as_view(), name='branch-update'),
	path('branch/delete/<uuid:pk>/', BranchDeleteView.as_view(), name='branch-delete'),

	#creating, reading, updating and deleting
	path('test/add/', CreateTestView.as_view(), name='add-test'),
	path('test/list/<uuid:branch_pk>/', TestListView.as_view(), name='test-list'),
	path('test/update/<uuid:test_pk>/', TestUpdateView.as_view(), name='test-update'),
	path('test/delete/<uuid:test_pk>/', TestDeleteView.as_view(), name='test-delete'),

	#creating, reading, updating and deleting results routes
	path('test/result/add/', CreateTestResultView.as_view(), name='add-test-result'),
	path('test/result/list/', TestResultListView.as_view(), name='results-list'),
	path('test/result/details/<uuid:pk>/', TestResultDetailView.as_view(), name='results-details'),
	path('test/result/update/<uuid:pk>/', TestResultUpdateView.as_view(), name='result-update'),
	path('test/result/delete/<uuid:pk>/', TestResultDeleteView.as_view(), name='result-delete'),

	#samples received by the laboratory routes
	path('samples-list/', LaboratorySampleList.as_view(), name='samples-list'),

	#url endpoints for creating, updating and deletion of laboratory samples
	path('lab/sample/add', LaboratorySampleSerializerView.as_view(), name='add-sample'),
    path('lab/sample/update/<uuid:pk>/', LaboratorySampleUpdateView.as_view(), name='update-sample'),
    path('lab/sample/delete/<uuid:pk>/', LaboratorySampleDeleteView.as_view(), name='delete-sample'),

    #the endpoint that handles test sample sent to the laboratory.
    path('lab/test-requests/samples/', HospitalSamplesView.as_view(), name='requested-tests')
]