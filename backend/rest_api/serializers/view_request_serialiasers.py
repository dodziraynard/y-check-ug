import logging

from django.contrib.auth import authenticate
from rest_framework import serializers

logger = logging.getLogger("app")


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        data["username"] = data["username"].lower()
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")


class ResponseSerialiser(serializers.Serializer):
    current_question_id = serializers.CharField()
    adolescent_id = serializers.CharField()
    value = serializers.CharField()
    option_ids = serializers.ListField()
