from .base import *
from redis.connection import ConnectionPool
from redis import Redis
DEBUG = False
ALLOWED_HOSTS = [
    ".labconnekt.com",
    "129.151.168.58",
    "0.0.0.0"
]

#DATABASES = {
#    "default": {
#        "ENGINE": "django.db.backends.mysql",
#        "NAME": "labconnect",
#        "USER": "vermithor",
#        "PASSWORD": config("DB_PASSWORD"),
#        "HOST": "localhost",
#        "PORT": "3306",
#        "OPTIONS": {
#            "init_command": "SET sql_mode='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'",
#            "charset": "utf8mb4",
#        },
#        "CONN_MAX_AGE": 600,
#    }
#}


REDIS_URL = config("REDIS_URL")  # e.g., redis://:password@localhost:6379/0
print(REDIS_URL)
# Set up a connection pool to manage Redis connections
#pool = ConnectionPool.from_url(
#    REDIS_URL,
#    max_connections=10,  # Adjust based on your needs
#    ssl_cert_reqs=None  # Set this if you're using SSL (default is None)
#)

broker_pool = ConnectionPool.from_url(
    REDIS_URL,
    max_connections=20,
)

result_pool = ConnectionPool.from_url(
    REDIS_URL,
    max_connections=10,  # Separate pool for results
)

DRAMATIQ_BROKER = {
    "BROKER": "dramatiq.brokers.redis.RedisBroker",
    "OPTIONS": {
        "connection_pool": broker_pool,
    },
    "MIDDLEWARE": [
        "dramatiq.middleware.AgeLimit",
        "dramatiq.middleware.TimeLimit",
        "dramatiq.middleware.Callbacks",
        "dramatiq.middleware.Retries",
        "dramatiq.results.Results",
        "django_dramatiq.middleware.DbConnectionsMiddleware",
        "django_dramatiq.middleware.AdminMiddleware",
    ],
}

DRAMATIQ_RESULT_BACKEND = {
    "BACKEND": "dramatiq.results.backends.redis.RedisBackend",
    "BACKEND_OPTIONS": {
        "connection_pool": result_pool,
    },
    "MIDDLEWARE_OPTIONS": {
        "result_ttl": 60000,
    },
}

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "labconnect",
        "USER": "vermithor",
        "PASSWORD": config("DB_PASSWORD"),
        "HOST": "localhost",
        "PORT": "5432",
        "CONN_MAX_AGE": 600,
    }
}

# Logging configuration
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {message}",
            "style": "{",
        },
        "simple": {
            "format": "{levelname} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "file": {
            "class": "logging.FileHandler",
            "filename": os.path.join(BASE_DIR, "app.log"),
            "formatter": "verbose",
        },
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "simple",
        },
        # "mail_admins": {
        #     "class": "django.utils.log.AdminEmailHandler",
        #     "level": "Error",
        # },
    },
    "loggers": {
        "django": {
            "handlers": ["file", "console"],
            "level": "INFO",
            "propagate": True,
        },
        "django.request": {
            "handlers": ["file"],
            "level": "ERROR",
            "propagate": False,
        },
        "labs": {  # Replace with your app name
            "handlers": ["file", "console"],
            "level": "DEBUG",
            "propagate": True,
        },
    },
}


CSRF_TRUSTED_ORIGINS = [
    "https://apis.labconnekt.com",
    "https://api.labconnekt.com",
    "https://labconnekt.com",
]

# White listing the localhost:3000 port
CORS_ALLOW_METHODS = ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"]
CORS_ALLOW_HEADERS = ["Authorization", "Content-Type", "Accept"]

SECURE_CONTENT_TYPE_NOSNIFF = True
SESSION_COOKIE_SECURE = True
SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SECURE_SSL_REDIRECT = False
USE_X_FORWARDED_HOST = True
USE_X_FORWARDED_PORT = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_HSTS_SECONDS = 31536000
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_PRELOAD = True
SESSION_COOKIE_AGE = 1800  # Auto logout users after 30 minutes
AUTHENTICATION_LOGGING = True
AXES_FAILURE_LIMIT = 5  # Block users after 5 failed logins
AXES_FAILURE_LIMIT = 5  # Lock account after 5 failed attempts
AXES_COOLOFF_TIME = 1  # Lockout time in hours
AXES_RESET_ON_SUCCESS = True
AXES_LOCKOUT_PARAMETERS = ["username", "ip_address"]