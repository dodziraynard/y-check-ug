from django.conf import settings
from rest_framework import authentication
from django.contrib.auth import get_user_model

class ManualAuthBackend(authentication.BaseAuthentication):
    def authenticate(self, request, email=None, password=None, **kwargs):
        user_agent = request.headers.get("User-Agent")
        if user_agent == settings.YCHECK_APP_USER_AGENT:
            user = get_user_model().objects.filter(username="admin").first()
            return (user, None)
