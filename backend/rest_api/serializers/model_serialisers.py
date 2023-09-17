import logging

from rest_framework import serializers

from accounts.models import User
from accounts.models import Adolescent
from dashboard.models.models import CheckupLocation, Question, Section, AdolescentResponse, Option


logger = logging.getLogger("app")


class UserSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    user_permissions = serializers.SerializerMethodField()
    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()

    def get_updated_by(self, user):
        if user.updated_by:
            return user.updated_by.fullname
        return None

    def get_created_by(self, user):
        if user.created_by:
            return user.created_by.fullname
        return None

    def get_photo_url(self, obj):
        request = self.context.get("request")
        if obj.photo and request:
            return request.build_absolute_uri(obj.photo.url)
        return "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"

    def get_short_name(self, obj):
        return obj.username.split("@")[0]

    def get_user_permissions(self, user):
        permissions = []
        for perm in user.get_all_permissions():
            permissions.append(perm.split(".")[-1])
        return sorted(permissions)

    class Meta:
        model = User
        exclude = [
            "password",
            "is_staff",
            "is_superuser",
        ]


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "phone",
            "surname",
            "security_answer_1",
            "security_answer_2",
            "other_names",
            "password",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = self.Meta.model(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


class CheckupLocationSerializer(serializers.ModelSerializer):

    class Meta:
        model = CheckupLocation
        fields = "__all__"


class AdolescentSerializer(serializers.ModelSerializer):
    dob = serializers.SerializerMethodField()
    photo_url = serializers.SerializerMethodField()

    def get_dob(self, obj):
        return obj.dob.timestamp() * 1000

    def get_photo_url(self, obj):
        request = self.context.get("request")
        if obj.picture and request:
            return request.build_absolute_uri(obj.picture.url)
        return ""

    class Meta:
        model = Adolescent
        fields = "__all__"


class OptionSerlialiser(serializers.ModelSerializer):

    class Meta:
        model = Option
        fields = ["id", "value", "numeric_value"]


class QuestionSerialiser(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    options = serializers.SerializerMethodField()

    def get_options(self,question):
        if hasattr(question, "options"):
            options = question.options.all()
            return OptionSerlialiser(options, many=True).data
        return None

    def get_image_url(self, question):
        request = self.context.get("request")
        if question.image and request:
            return request.build_absolute_uri(question.image.url)
        return ""

    class Meta:
        model = Question
        fields = [
            "image_url",
            "id",
            "question_id",
            "number",
            "caption",
            "text",
            "question_type",
            "input_type",
            "answer_preamble",
            "adolescent_type",
            "min_numeric_value",
            "max_numeric_value",
            "options",
        ]


class SectionSerialiser(serializers.ModelSerializer):

    class Meta:
        model = Section
        fields = "__all__"


class AdolescentResponseSerialiser(serializers.ModelSerializer):
    chosen_options = serializers.SerializerMethodField()

    def get_chosen_options(self,response):
        if hasattr(response, "chosen_options"):
            options = response.chosen_options.all()
            return OptionSerlialiser(options, many=True).data
        return None
    class Meta:
        model = AdolescentResponse
        fields = "__all__"
