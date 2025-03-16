from django.urls import path 
from .views import FetchTestTemplates

app_name = 'modelmixins'
urlpatterns = [
    # creating, reading, updating and deleting laboratory
    path("list-test-templates/", FetchTestTemplates.as_view(), name="test-templates")
]
