from django.urls import path
from .views import HomeView, CreateHospital, HospitalUpdate


app_name = 'hospital'
urlpatterns = [

	path('', HomeView.as_view(), name='home'),
	path('hospital/create/', CreateHospital.as_view(), name='hospital-create'),
	path('hospital/update/<int:pk>/', CreateHospital.as_view(), name='hospital-update'),

]