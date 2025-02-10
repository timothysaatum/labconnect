from django.urls import path # type: ignore
from .views import (
    CreateLaboratoryView,
    LaboratoryUserVIew,
    CreateTestView,
    TestUpdateView, 
    BranchListView, 
    BranchUpdateView, 
    CreateBranchView,
	BranchDeleteView, 
    TestListView,
    TestDeleteView, 
    AllLaboratories,
    UpdateLaboratoryDetails,
    DeleteLaboratory,
    SampleTypeView,
    SampleTypeUpdateView,
    SampleTypeDeleteView,
    GetTestSampleType,
    UpdateTestForSpecificBranch,
    CopyTests
)


app_name = 'laboratory'
urlpatterns = [
    # creating, reading, updating and deleting laboratory
    path("create/", CreateLaboratoryView.as_view(), name="laboratory"),
    path("user-laboratory/", LaboratoryUserVIew.as_view(), name="user-lab"),
    path("update/<uuid:pk>/", UpdateLaboratoryDetails.as_view(), name="lab-update"),
    path("delete/<uuid:pk>/", DeleteLaboratory.as_view(), name="lab-delete"),
    # creating, reading, updating and deleting Branch
    path("create-branch/", CreateBranchView.as_view(), name="create-branch"),
    path("branch/list/", BranchListView.as_view(), name="laboratory-list"),
    path("list/", BranchListView.as_view(), name="laboratory-list"),
    path("branch/all/", AllLaboratories.as_view(), name="all-labs"),
    path("branch/update/<uuid:pk>/", BranchUpdateView.as_view(), name="branch-update"),
    path("branch/delete/<uuid:pk>/", BranchDeleteView.as_view(), name="branch-delete"),
    # creating, reading, updating and deleting Test
    path("test/add/", CreateTestView.as_view(), name="add-test"),
    path("test/list/<uuid:pk>/", TestListView.as_view(), name="test-list"),
    path("test/update/<uuid:pk>/", TestUpdateView.as_view(), name="test-update"),
    path("test/delete/<uuid:pk>/", TestDeleteView.as_view(), name="test-delete"),
    # sample type routes
    path("sample-type/add/", SampleTypeView.as_view(), name="add-sample-type"),
    path(
        "sample-type/update/<int:pk>/",
        SampleTypeUpdateView.as_view(),
        name="sample-type-update",
    ),
    path(
        "sample-type/delete/<int:pk>/",
        SampleTypeDeleteView.as_view(),
        name="sample-type-delete",
    ),
    path(
        "get-test/sample-type/<uuid:pk>/",
        GetTestSampleType.as_view(),
        name="test-sample-type",
    ),
    # utility endpoints
    path(
        "update/test-for-branch/<uuid:branch_id>/<uuid:test_id>/",
        UpdateTestForSpecificBranch.as_view(),
        name="specific-update",
    ),
    path(
        "copy-tests-to-another-branch/<uuid:branch_to_copy_to_id>/",
        CopyTests.as_view(),
        name="copy-test",
    ),
]
