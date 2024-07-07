"""
Django settings for ycheck project.

Generated by 'django-admin startproject' using Django 4.2.3.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get(
    'SECRET_KEY', default='qd#3^56(!u=x*&ij8f3x$&iuvzan%#6@ge)ssbqq_87ahoxifp')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = int(os.environ.get("DEBUG", default=1))
YCHECK_APP_USER_AGENT = os.environ.get("YCHECK_APP_USER_AGENT",
                                             "YC_WEB_VIEW")

ALLOWED_HOSTS = ['*']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'knox',
    'corsheaders',
    'accounts.apps.AccountsConfig',
    'setup.apps.SetupConfig',
    'rest_framework.authtoken',
    'dashboard.apps.DashboardConfig',
    'rest_api.apps.RestApiConfig',
    'pdf_processor.apps.PdfProcessorConfig',
    "django_celery_beat",
]

AUTH_USER_MODEL = 'accounts.User'
REST_KNOX = {
    'SECURE_HASH_ALGORITHM': 'cryptography.hazmat.primitives.hashes.SHA512',
    'AUTH_TOKEN_CHARACTER_LENGTH': 64,
    'TOKEN_TTL': None,
    'USER_SERIALIZER': 'knox.serializers.UserSerializer',
    'TOKEN_LIMIT_PER_USER': 1,
    'AUTO_REFRESH': True,
    'AUTH_HEADER_PREFIX': 'Token',
}
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES':
    ('rest_framework.permissions.IsAuthenticatedOrReadOnly', ),
    'DEFAULT_AUTHENTICATION_CLASSES': [
        "ycheck.utils.manual_authentication.ManualAuthBackend",
        'knox.auth.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication'
    ]
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'ycheck.urls'

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

WSGI_APPLICATION = 'ycheck.wsgi.application'

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": os.environ.get("SQL_ENGINE", "django.db.backends.sqlite3"),
        "NAME": os.environ.get("SQL_DATABASE", BASE_DIR / "db.sqlite3"),
        "USER": os.environ.get("SQL_USER", "user"),
        "PASSWORD": os.environ.get("SQL_PASSWORD", "password"),
        "HOST": os.environ.get("SQL_HOST", "localhost"),
        "PORT": os.environ.get("SQL_PORT", "5432"),
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME':
        'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

CORS_ALLOW_ALL_ORIGINS = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

STATIC_ROOT = BASE_DIR / 'staticfiles/'

MEDIA_URL = '/assets/'
STATICFILES_DIRS = [BASE_DIR / 'static']

MEDIA_ROOT = BASE_DIR / "assets"
TEMP_REPORT_DIR = MEDIA_ROOT / "temp/reports/"
TEMP_REPORT_URL = MEDIA_URL + "temp/reports/"
X_FRAME_OPTIONS = 'ALLOW'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CSRF_TRUSTED_ORIGINS = os.environ.get("CSRF_TRUSTED_ORIGINS",
                                      "http://*").split(",")
CSRF_ALLOWED_ORIGINS = os.environ.get("CSRF_TRUSTED_ORIGINS",
                                      "http://*").split(",")
CORS_ORIGINS_WHITELIST = os.environ.get("CSRF_TRUSTED_ORIGINS",
                                        "http://*").split(",")

USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

CELERY_BROKER_URL = os.environ.get("REDIS_URL", "redis://localhost:6379")
CELERY_RESULT_BACKEND = os.environ.get("REDIS_URL", "redis://localhost:6379")
SITE_CODE = os.environ.get("SITE_CODE", "LC")
NODE_NAME = os.environ.get("NODE_NAME", "Please configure NODE_NAME env")
UPSTREAM_HOST = os.environ.get("UPSTREAM_HOST", "")
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_IMPORTS = [
    "dashboard.tasks",
    "pdf_processor.tasks",
    "rest_api.tasks",
]

REDIS_HOST = os.environ.get(
    "REDIS_URL", "redis://localhost:6379").split("//")[1].split(":")[0]
REDIS_PORT = os.environ.get(
    "REDIS_URL", "redis://localhost:6379").split("//")[1].split(":")[1]
