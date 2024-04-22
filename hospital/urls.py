from django.urls import path
from .views import (HospitalSerializerView, SampleSerializerView, 
	SampleListView, SampleDetailView, SampleUpdateView, SampleDeleteView)


app_name = 'hospital'
urlpatterns = [

	path('list/', HospitalSerializerView.as_view(), name='hospital-list'),
	path('clinician/sample/add/', SampleSerializerView.as_view(), name='add-sample'),
	path('sample/list/', SampleListView.as_view(), name='sample'),
	path('sample/details/<int:pk>/', SampleDetailView.as_view(), name='sample-details'),
	path('sample/update/<int:pk>/', SampleUpdateView.as_view(), name='sample-update'),
	path('sample/delete/<int:pk>/', SampleDeleteView.as_view(), name='delete-sample'),

]