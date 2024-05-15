from django.urls import path
from .views import (
    HospitalSerializerView, 
    SampleSerializerView, 
	SampleListView, 
    SampleDetailView, 
	SampleUpdateView, 
    SampleDeleteView, 
    SampleResultList
)


app_name = 'hospital'
urlpatterns = [

	path('list/', HospitalSerializerView.as_view(), name='hospital-list'),
	path('health-worker/add/sample/', SampleSerializerView.as_view(), name='add-sample'),
	path('health-worker/sample/list/', SampleListView.as_view(), name='sample-list'),
	path('health-worker/sample/details/<int:pk>/', SampleDetailView.as_view(), name='sample-details'),
	path('health-worker/update/sample/<int:pk>/', SampleUpdateView.as_view(), name='sample-update'),
	path('health-worker/delete/sample/<int:pk>/', SampleDeleteView.as_view(), name='delete-sample'),
	path('health-worker/result-list/', SampleResultList.as_view(), name='result-list'),

]