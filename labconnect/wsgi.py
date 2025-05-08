import os
from decouple import config

ENV = config("DJANGO_ENV").lower()
# Set the settings module dynamically based on ENV
from django.core.wsgi import get_wsgi_application


os.environ.setdefault("DJANGO_SETTINGS_MODULE", f"labconnect.settings.{ENV}")

application = get_wsgi_application()
