from django.contrib import admin # type: ignore
from django.urls import path, include # type: ignore
from django.conf import settings # type: ignore
from django.conf.urls.static import static # type: ignore
# from django_prometheus import exports


urlpatterns = [
    path("grappelli/", include("grappelli.urls")),
    path("admin/", admin.site.urls),
    path("api/delivery/", include("delivery.urls")),
    path("api/hospital/", include("hospital.urls")),
    path("api/user/", include("user.urls")),
    path("api/laboratory/", include("labs.urls")),
    path("api/sample/", include("sample.urls")),
    path("api/transactions/", include("transactions.urls")),
    path("api/utils/", include("modelmixins.urls")),
    path("api/analytics/", include("analytics.urls")),
    # path("metrics/", exports.ExportToDjangoView, name="metrics"),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)

admin.site.site_header  =  "LabConnect Admin"  
admin.site.site_title  =  "LabConnect Admin"
admin.site.index_title  =  "LabConnect Admin"
