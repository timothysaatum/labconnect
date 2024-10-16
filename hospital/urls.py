from django.urls import path
from .views import (
    HospitalSerializerView, 
    SampleSerializerView, 
	SampleListView, 
	SampleUpdateView, 
    SampleDeleteView, 
    AddHospitalView,
    UpdateHospitalView,
    DeleteHospitalView,
    UserHospital,
    CreateHospitalLab,
    UpdateHospitalLab,
    DeleteHospitalLab,
    CreateHospitalLabTest,
    GetHospitalLabTest
)


app_name = 'hospital'
urlpatterns = [

	path('add/', AddHospitalView.as_view(), name='add-hospital'),
	path('update/<uuid:pk>/', UpdateHospitalView.as_view(), name='add-hospital'),
	path('delete/<uuid:pk>/', DeleteHospitalView.as_view(), name='delete-hospital'),
    path('get-user-hospital/', UserHospital.as_view(), name='user-hospital'),
	path('list/', HospitalSerializerView.as_view(), name='hospital-list'),
	path('health-worker/add/sample/', SampleSerializerView.as_view(), name='add-sample'),
	path('health-worker/sample/list/', SampleListView.as_view(), name='sample-list'),
	path('health-worker/update/sample/<int:pk>/', SampleUpdateView.as_view(), name='sample-update'),
	path('health-worker/delete/sample/<int:pk>/', SampleDeleteView.as_view(), name='delete-sample'),
    path('hospital/add-lab/', CreateHospitalLab.as_view(), name='add-lab'),
    path('hospital/update-lab/<uuid:hospital_lab_id>/', UpdateHospitalLab.as_view(), name='update-lab'),
    path('hospital/delete-lab/<uuid:pk>/', DeleteHospitalLab.as_view(), name='delete-lab'),
    path('hospital/add-lab-test/', CreateHospitalLabTest.as_view(), name='add-lab-test'),
    path('hospital/get-lab-test/<uuid:h_lab_id>/', GetHospitalLabTest.as_view(), name='get-lab-test'),

]