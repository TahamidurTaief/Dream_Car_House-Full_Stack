from .base import *
import os

DEBUG = True
ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = INSTALLED_APPS + [
    'django_extensions',
    'drf_yasg',
]

# ✅ এটাই আসল fix — localhost-এ SSL redirect বন্ধ করো
SECURE_PROXY_SSL_HEADER = None
USE_X_FORWARDED_HOST = False
SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

# Database — SQLite for local
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.path.join(BASE_DIR, "db.sqlite3"),
    }
}

SWAGGER_SETTINGS = {
    'DEFAULT_FIELD_INSPECTORS': [
        'drf_yasg.inspectors.CamelCaseJSONFilter',
        'drf_yasg.inspectors.InlineSerializerInspector',
        'drf_yasg.inspectors.RelatedFieldInspector',
        'drf_yasg.inspectors.ChoiceFieldInspector',
        'drf_yasg.inspectors.FileFieldInspector',
        'drf_yasg.inspectors.DictFieldInspector',
        'drf_yasg.inspectors.SimpleFieldInspector',
        'drf_yasg.inspectors.StringDefaultFieldInspector',
    ],
}

# CORS — localhost-এ সব allow
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH',
]