from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers
from . models import *

class UserSerializerWithToken(serializers.ModelSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'token', 'is_active', 'is_staff', 'is_superuser']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


