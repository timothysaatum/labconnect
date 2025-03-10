"""
ASGI config for labconnect project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
from decouple import config
ENV = config("DJANGO_ENV", default="production").lower()
from django.core.asgi import get_asgi_application

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'labconnect.settings')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", f"labconnect.settings.{ENV}")

application = get_asgi_application()
