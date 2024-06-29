from django.conf import settings
from rest_framework import authentication
from django.contrib.auth import get_user_model

class ManualAuthBackend(authentication.BaseAuthentication):
    def authenticate(self, request, email=None, password=None, **kwargs):
        token = (request.META.get("HTTP_AUTHORIZATION", "Token null").split("Token")[1] or "").strip()

        if token == settings.MANUAL_AUTHENTICATION_TOKEN or token == "":
            user = get_user_model().objects.filter(username="admin").first()
            return (user, None)
