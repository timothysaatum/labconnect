from django.urls import path, include
from .views import FetchTestTemplates, DepartmentViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet, basename='department')

app_name = 'modelmixins'
urlpatterns = [
    # creating, reading, updating and deleting laboratory
    path("list-test-templates/", FetchTestTemplates.as_view(), name="test-templates"),
    path('', include(router.urls)),
]