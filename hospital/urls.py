from django.urls import path
from .views import HospitalSerializerView, WardSerializerView, SampleSerializerView


app_name = 'hospital'
urlpatterns = [

	path('create/', HospitalSerializerView.as_view(), name='home'),
	path('ward/add/', WardSerializerView.as_view(), name='add-ward'),
	path('clinician/sample/add/', SampleSerializerView.as_view(), name='add-sample'),

]