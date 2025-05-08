import os
from decouple import config
ENV = config("DJANGO_ENV", default="production").lower()
from django.core.asgi import get_asgi_application


os.environ.setdefault("DJANGO_SETTINGS_MODULE", f"labconnect.settings.{ENV}")

application = get_asgi_application()
