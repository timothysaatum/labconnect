from decouple import config

ENVIRONMENT = config("DJANGO_ENV")

if ENVIRONMENT == "production":
    from .production import *

else:
    from .development import *
