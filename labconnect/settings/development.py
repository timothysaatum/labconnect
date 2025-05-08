from .base import *

DEBUG = True
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
# LOGGING = {
#     "version": 1,
#     "disable_existing_loggers": False,
#     "formatters": {
#         "verbose": {
#             "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
#             "style": "{",
#         },
#         "simple": {
#             "format": "{levelname} {message}",
#             "style": "{",
#         },
#     },
#     "handlers": {
#         "file": {
#             "class": "logging.handlers.RotatingFileHandler",
#             "filename": os.path.join(BASE_DIR, "app.log"),
#             "formatter": "verbose",
#             "maxBytes": 10485760,  # 10MB
#             "backupCount": 5,      # Keep 5 backup files
#         },
#         "console": {
#             "class": "logging.StreamHandler",
#             "formatter": "simple",
#         },
#         "mail_admins": {
#             "class": "django.utils.log.AdminEmailHandler",
#             "level": "ERROR",
#         },
#     },
#     "loggers": {
#         "django": {
#             "handlers": ["file", "console"],
#             "level": "INFO",
#             "propagate": True,
#         },
#         "django.request": {
#             "handlers": ["file"],
#             "level": "ERROR",
#             "propagate": False,
#         },
#         "labs": {  # Replace with your app name
#             "handlers": ["file", "console"],
#             "level": "DEBUG",
#             "propagate": True,
#         },
#         "labs.critical": {  
#             "handlers": ["file", "console", "mail_admins"],
#             "level": "ERROR",
#             "propagate": False,
#         },
#     },
# }