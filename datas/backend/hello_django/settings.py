"""
Django settings for hello_django project.

Generated by 'django-admin startproject' using Django 4.2.3.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""
import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent



# HTTPS CONFIG / SELEN
# settings.py
# Assurez-vous que Django redirige toutes les connexions HTTP vers HTTPS en production
SECURE_SSL_REDIRECT = False  # Mettre à True en production

# Configurez le header sécurisé utilisé pour indiquer que la connexion est sécurisée
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Configurez la redirection HTTPS sécurisée pour tous les cookies de session et persistants
#SESSION_COOKIE_SECURE = True  # Mettre à True en production
#CSRF_COOKIE_SECURE = True  # Mettre à True en production

# Configurez la politique HSTS (HTTP Strict Transport Security)
SECURE_HSTS_SECONDS = 0  # Désactivé en développement, mettre à 31536000 (1 an) en production
SECURE_HSTS_INCLUDE_SUBDOMAINS = False  # Désactivé en développement, mettre à True en production
SECURE_HSTS_PRELOAD = False  # Désactivé en développement, mettre à True en production


# Chemins vers le certificat et la clé privée
SSL_CERTIFICATE = '/etc/ssl/cert.pem'
SSL_KEY = '/etc/ssl/key.pem'


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("SECRET_KEY")
#SECRET_KEY = "coucou"

DEBUG = bool(os.environ.get("DEBUG", default=0))
#DEBUG = True

# 'DJANGO_ALLOWED_HOSTS' should be a single string of hosts with a space between each.
# For example: 'DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]'
DJANGO_ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS").split(" ")
#DJANGO_ALLOWED_HOSTS="localhost 127.0.0.1 [::1]"
# SECURITY WARNING: don't run with debug turned on in production!


CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = os.environ.get("DJANGO_ALLOWED_ORIGINS").split(" ")
CSRF_COOKIE_SECURE = True

AUTH_USER_MODEL = 'users.User'
# Application definition


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
	'corsheaders',
	'rest_framework',
	"rest_framework.authtoken",
	'singlepage',
	'users',
	'rest_framework_simplejwt',
	'rest_framework_simplejwt.token_blacklist',
    'oauth2_provider',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
	'corsheaders.middleware.CorsMiddleware',
]

ROOT_URLCONF = 'hello_django.urls'

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

WSGI_APPLICATION = 'hello_django.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
		"NAME": os.environ.get("SQL_DATABASE", "database"),
        "USER": os.environ.get("SQL_USER", "user"),
        "PASSWORD": os.environ.get("SQL_PASSWORD", "password"),
        "HOST": os.environ.get("SQL_HOST", "localhost"),
        "PORT": os.environ.get("SQL_PORT", "5432"),
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators
AUTH_USER_MODEL = 'users.User'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

from datetime import timedelta

SIMPLE_JWT = {
    'REFRESH_TOKEN_LIFETIME': timedelta(days=15),
    'ROTATE_REFRESH_TOKENS': True,

  # It will work instead of the default serializer(TokenObtainPairSerializer).
  	"TOKEN_OBTAIN_SERIALIZER": "users.serializers.CustomTokenObtainPairSerializer",

}

REST_FRAMEWORK = {

	'DEFAULT_AUTHENTICATION_CLASSES': [
# ...
		'rest_framework_simplejwt.authentication.JWTAuthentication',
        # 'oauth2_provider.contrib.rest_framework.OAuth2Authentication',
	]

}
