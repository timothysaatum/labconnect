from pathlib import Path
import os
from datetime import timedelta
from decouple import config
# import sentry_sdk
# from sentry_sdk.integrations.django import DjangoIntegration

# from redis.connection import ConnectionPool


BASE_DIR = Path(__file__).resolve().parent.parent


SECRET_KEY = config('SECRET_KEY')
FIELD_ENCRYPTION_KEY = config("FIELD_ENCRYPTION_KEY")


# DEBUG = True
# ALLOWED_HOSTS = ["*"]

# Application definition
INSTALLED_APPS = [
    "grappelli",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework_simplejwt.token_blacklist",
    "django_filters",
    # "django_multidb_router",
    "analytics",
    "modelmixins",
    # 'django_dramatiq',
    "sample",
    "user",
    "hospital",
    "labs",
    "transactions",
    "delivery",
    "corsheaders",
    "rest_framework",
    "axes",
    "simple_history",
]

# INSTALLED_APPS += ["django_prometheus"]


MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "user.middleware.validator.PermissionMiddleware",
    "axes.middleware.AxesMiddleware",
    # "user.middleware.prometheus.MetricsAccessMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


AUTHENTICATION_BACKENDS = [
    'axes.backends.AxesStandaloneBackend',
    'django.contrib.auth.backends.ModelBackend',
]

# MIDDLEWARE += ["axes.middleware.AxesMiddleware"]
# MIDDLEWARE = (
#     ["django_prometheus.middleware.PrometheusBeforeMiddleware"]
#     + MIDDLEWARE
#     + ["django_prometheus.middleware.PrometheusAfterMiddleware"]
# )

DATABASES = {}

INTERNAL_IPS = '127.0.0.1'
ROOT_URLCONF = 'labconnect.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'labconnect.wsgi.application'
ADMINS = [
    ("Vermithor", "timothysaatum@gmail.com"),
]
PAYSTACK_SECRET = config("PAYSTACK_SECRET_KEY")

PAYSTACK_BASE_URL = "https://api.paystack.co"
PAYSTACK_SUBACCOUNT_URL = "https://api.paystack.co/subaccount"
PAYSTACK_REFUND_URL = "https://api.paystack.co/refund"
PAYSTACK_TRANSFER_URL = "https://api.paystack.co/transfer"

# sentry_sdk.init(
#     dsn=config("SENTRY_DSN"),
#     integrations=[DjangoIntegration()],
#     traces_sample_rate=1.0,
#     _experiments={
#         "continuous_profiling_auto_start": True,
#     },
# )

# CACHES = {
#     'default': {
#         'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
#         'LOCATION': 'key_cache_table',
#     }
# }


# REDIS_URL = config(
#     "REDIS_URL"
# )

# # REDIS_URL = "redis://localhost:6379"
# pool = ConnectionPool.from_url(REDIS_URL, max_connections=10)
# # dramatiq_broker = UpstashBroker(redis_url=UPSTASH_URL, redis_token=UPSTASH_TOKEN)
# DRAMATIQ_BROKER = {
#     "BROKER": "dramatiq.brokers.redis.RedisBroker",  # "uptash_broker.UpstashBroker",
#     "OPTIONS": {
#         "url": REDIS_URL,
#         "ssl": True,  # Enable SSL for secure connection to Upstash
#         "connection_pool": pool,
#         "ssl_cert_reqs": None,
#     },
#     "MIDDLEWARE": [
#         "dramatiq.middleware.AgeLimit",
#         "dramatiq.middleware.TimeLimit",
#         "dramatiq.middleware.Callbacks",
#         "dramatiq.middleware.Retries",
#         "dramatiq.results.Results",
#         "django_dramatiq.middleware.DbConnectionsMiddleware",
#         "django_dramatiq.middleware.AdminMiddleware",
#     ],
# }


# DRAMATIQ_RESULT_BACKEND = {
#     "BACKEND": "dramatiq.results.backends.redis.RedisBackend",
#     "BACKEND_OPTIONS": {
#         "url": REDIS_URL#"redis://localhost:6379",
#     },
#     "MIDDLEWARE_OPTIONS": {
#         "result_ttl": 60000
#     }
# }


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', "OPTIONS": {"min_length": 12}
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # React dev server
    "http://127.0.0.1:5173",  # Alternate localhost
    "https://labconnect-eight.vercel.app",  # React production URL if needed
    "https://labconnekt.com",  # Correct frontend URL
    "https://apis.labconnekt.com",
]

CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https:\/\/.*\.labconnekt\.com$",  # Allows any subdomain (e.g., app.labconnekt.com)
]

# White listing the localhost:3000 port
# for React
CORS_ORIGIN_WHITELIST = ("http://localhost:5173", "https://labconnect-eight.vercel.app")
CORS_ALLOW_CREDENTIALS = True

LOGIN_URL = 'client:login'
LOGIN_REDIRECT_URL = 'hospital:home'
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = config('EMAIL_USER')
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD")  # "nkbdtufounzmcmxd"


LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

AUTH_USER_MODEL = 'user.Client'


REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.FormParser",
        "rest_framework.parsers.MultiPartParser",
    ],
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "100/day",
        "user": "1000/day",
    },
}


# CACHES = {
#     "default": {
#         "BACKEND": "django_redis.cache.RedisCache",
#         "LOCATION": "redis://127.0.0.1:6379/1",
#         "OPTIONS": {
#             "CLIENT_CLASS": "django_redis.client.DefaultClient",
#         },
#     }
# }


SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=100),
    "REFRESH_TOKEN_LIFETIME": timedelta(hours=100),
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_COOKIE": "refresh_token",
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_COOKIE_DOMAIN": None,
    "AUTH_COOKIE_PATH": "/",
    "AUTH_COOKIE_SECURE": True,
    "AUTH_COOKIE_HTTP_ONLY": True,
    "AUTH_COOKIE_SAMESITE": "None",
    "USER_ID_CLAIM": "user_id",
}


STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, "static")
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
PAYSTACK_PUBLIC_KEY = config('PAYSTACK_PUBLIC_KEY')
PAYSTACK_SECRET_KEY = config('PAYSTACK_SECRET_KEY')