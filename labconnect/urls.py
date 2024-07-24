"""
URL configuration for labconnect project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [

    path('admin/', admin.site.urls),
    path('api/delivery/', include('delivery.urls')),
    path('api/hospital/', include('hospital.urls')),
    path('api/user/', include('user.urls')),
    path('api/laboratory/', include('labs.urls')),
    path('api/sample/', include('sample.urls')),
    path('api/transactions/', include('transactions.urls')),
    path('api/user/profile/', include('profiles.urls')),
    #path('__debug__/', include('debug_toolbar.urls'))

]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)

admin.site.site_header  =  "LabConnect Admin"  
admin.site.site_title  =  "LabConnect Admin"
admin.site.index_title  =  "LabConnect Admin"