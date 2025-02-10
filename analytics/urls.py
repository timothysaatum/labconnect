from django.urls import path
from .views import LaboratoryInsightsAPIView


app_name = 'analytics'
urlpatterns = [
    path("laboratory-analytics/<uuid:lab_id>/", LaboratoryInsightsAPIView.as_view(), name='lab-analytics'),
]
