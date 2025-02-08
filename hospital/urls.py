from django.urls import path
from .views import (
    HospitalSerializerView, 
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
    path('hospital/add-lab/', CreateHospitalLab.as_view(), name='add-lab'),
    path('hospital/update-lab/<uuid:hospital_lab_id>/', UpdateHospitalLab.as_view(), name='update-lab'),
    path('hospital/delete-lab/<uuid:pk>/', DeleteHospitalLab.as_view(), name='delete-lab'),
    path('hospital/add-lab-test/', CreateHospitalLabTest.as_view(), name='add-lab-test'),
    path('hospital/get-lab-test/<uuid:h_lab_id>/', GetHospitalLabTest.as_view(), name='get-lab-test'),

]