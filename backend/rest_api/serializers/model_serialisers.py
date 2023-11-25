import logging
from django.contrib.auth.models import Group, Permission

from rest_framework import serializers
import timeago
from datetime import datetime
from accounts.models import User
from setup.models import MobileConfig
from dashboard.models import *
from django.utils.timezone import make_aware


logger = logging.getLogger("app")


class MobileConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = MobileConfig
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    user_permissions = serializers.SerializerMethodField()
    created_by = serializers.SerializerMethodField()
    groups = serializers.SerializerMethodField()
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

    def get_groups(self, obj):
        return obj.groups.values_list("name", flat=True)

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
    fullname = serializers.SerializerMethodField()
    photo_url = serializers.SerializerMethodField()

    def get_dob(self, obj):
        if obj.dob:
            return int(obj.dob.timestamp() * 1000)
        return 0

    def get_fullname(self, obj):
        return f"{obj.surname} {obj.other_names}"

    def get_photo_url(self, obj):
        request = self.context.get("request")
        if obj.picture and request:
            return request.build_absolute_uri(obj.picture.url)
        return "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"

    class Meta:
        model = Adolescent
        fields = "__all__"


class OptionSerlialiser(serializers.ModelSerializer):
    value = serializers.SerializerMethodField()
    audio_url = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, option):
        request = self.context.get("request")
        if option.image and request:
            return request.build_absolute_uri(option.image.url)
        return ""

    def get_audio_url(self, option):
        request = self.context.get("request")
        if option.audio_file and request:
            return request.build_absolute_uri(option.audio_file.url)
        return ""

    def get_value(self, obj):
        value = f"{obj.value}"
        if obj.context:
            value += f" {obj.context}"
        return value

    class Meta:
        model = Option
        fields = ["id", "value", "numeric_value", "audio_url", "image_url"]


class QuestionSerialiser(serializers.ModelSerializer):
    text = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    options = serializers.SerializerMethodField()
    audio_url = serializers.SerializerMethodField()
    has_image_options = serializers.SerializerMethodField()

    def get_has_image_options(self, question):
        if hasattr(question, "options"):
            if not hasattr(self, "options"):
                self.options = question.options.all()
            for option in self.options:
                if option.has_image():
                    return True
        return False

    def get_text(self, question):
        return f"({question.question_id}). {question.text}"

    def get_audio_url(self, question):
        request = self.context.get("request")
        if question.audio_file and request:
            return request.build_absolute_uri(question.audio_file.url)
        return ""

    def get_options(self, question):
        if hasattr(question, "options"):
            if not hasattr(self, "options"):
                self.options = question.options.all()
            return OptionSerlialiser(self.options, context=self.context, many=True).data
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
            "apk_id",
            "answer_preamble",
            "adolescent_type",
            "min_numeric_value",
            "max_numeric_value",
            "options",
            "to_be_confirmed",
            "audio_url",
            "has_image_options",
        ]


class SectionSerialiser(serializers.ModelSerializer):

    class Meta:
        model = Section
        fields = "__all__"


class AdolescentResponseSerialiser(serializers.ModelSerializer):
    chosen_options = serializers.SerializerMethodField()

    def get_chosen_options(self, response):
        if hasattr(response, "chosen_options"):
            options = response.chosen_options.all()
            return OptionSerlialiser(options, context=self.context,  many=True).data
        return None

    class Meta:
        model = AdolescentResponse
        fields = "__all__"


class SummaryFlagSerializer(serializers.ModelSerializer):
    responses = serializers.SerializerMethodField()
    comment = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    def get_name(self, obj):
        return obj.label.name

    def get_comment(self, obj):
        if obj.comment and obj.updated_by:
            now = make_aware(datetime.now())
            return f"{obj.comment} ({obj.updated_by.get_name()}, {timeago.format(obj.updated_at, now)})"

    def get_responses(self, obj):
        return obj.get_responses()

    class Meta:
        model = SummaryFlag
        fields = "__all__"


class FacilitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Facility
        fields = "__all__"


class GroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = "__all__"


class FlagLabelSerializer(serializers.ModelSerializer):

    class Meta:
        model = FlagLabel
        fields = ["id", "name"]


class ServiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Service
        fields = "__all__"

    def to_representation(self, instance):
        response = super().to_representation(instance)

        # Check if related_flag_labels is a single instance or a queryset
        # Assuming related_flag_labels is a ManyToManyField
        related_flag_labels = instance.related_flag_labels.all()

        if related_flag_labels:
            # If there are related flags, serialize them as a list of dictionaries
            response['related_flag_labels'] = FlagLabelSerializer(
                related_flag_labels, many=True).data
        else:
            # If there are no related flags, set it to an empty list
            response['related_flag_labels'] = []

        return response


class GroupPermissionSerializer(serializers.ModelSerializer):
    group_has = serializers.SerializerMethodField()

    def get_group_has(self, obj):
        group = self.context.get("group")
        return group.permissions.filter(id=obj.id).exists() if group else []

    class Meta:
        model = Permission
        fields = "__all__"


class ReferralSerialiser(serializers.ModelSerializer):
    facility_name = serializers.SerializerMethodField()
    services = ServiceSerializer(many=True)
    created_by = serializers.SerializerMethodField()
    adolescent = AdolescentSerializer()

    def get_created_by(self, obj):
        created_by = {
            "fullname": obj.created_by.get_name(),
            "phone": obj.created_by.phone,
        }
        return created_by

    def get_facility_name(self, obj):
        return obj.facility.name

    class Meta:
        model = Referral
        fields = "__all__"


class TreatmentSerialiser(serializers.ModelSerializer):
    adolescent = AdolescentSerializer()
    facility_name = serializers.SerializerMethodField()
    further_referred_to = serializers.SerializerMethodField()

    def get_facility_name(self, obj):
        return obj.referral.facility.name

    def get_further_referred_to(self, obj):
        if obj.further_referral_facility:
            return obj.further_referral_facility.name
        return ""

    class Meta:
        model = Treatment
        fields = "__all__"
