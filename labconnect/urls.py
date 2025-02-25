from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
# from django_prometheus import exports


urlpatterns = [
    path("grappelli/", include("grappelli.urls")),
    path("admin/v1/manager/labconnect/", admin.site.urls),
    path("delivery/", include("delivery.urls")),
    path("hospital/", include("hospital.urls")),
    path("user/", include("user.urls")),
    path("laboratory/", include("labs.urls")),
    path("sample/", include("sample.urls")),
    path("transactions/", include("transactions.urls")),
    path("analytics/", include("analytics.urls")),
    # path("metrics/", exports.ExportToDjangoView, name="metrics"),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)

admin.site.site_header  =  "LabConnect Admin"  
admin.site.site_title  =  "LabConnect Admin"
admin.site.index_title  =  "LabConnect Admin"
