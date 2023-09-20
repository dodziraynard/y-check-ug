import datetime
import json
import logging
from django.utils.timezone import make_aware

from django.contrib.auth import authenticate
from knox.models import AuthToken
from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from ycheck.utils.constants import ResponseInputType
from dashboard.models import Question, Section
from ycheck.utils.functions import apply_filters
from dashboard.models.models import Adolescent, CheckupLocation, AdolescentResponse, Option

from ycheck.utils.functions import get_all_user_permissions
from rest_api.serializers import (LoginSerializer,
                                  CheckupLocationSerializer,
                                  AdolescentSerializer,
                                  QuestionSerialiser,
                                  SectionSerialiser,
                                  ResponseSerialiser,
                                  AdolescentResponseSerialiser,
                                  RegisterSerializer, UserSerializer)

logger = logging.getLogger("app")


class UserLoginAPI(generics.GenericAPIView):
    """
    Login a user and return a token for the user.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            for field in list(e.detail):
                error_message = e.detail.get(field)[0]
                field = field + ":" if field != "non_field_errors" else ""
                response_data = {
                    "error_message": f"{field}{error_message}",
                    "user": None,
                    "token": None,
                }
                return Response(response_data, status=status.HTTP_200_OK)

        user = serializer.validated_data
        user.save()
        AuthToken.objects.filter(user=user).delete()

        response_data = {
            "error_message": None,
            "user": UserSerializer(user).data,
            "token": AuthToken.objects.create(user)[1],
        }
        return Response(response_data, status=status.HTTP_200_OK)


class UserRegistrationAPI(generics.GenericAPIView):
    """
    Register a new user and return a token for the user.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        request_data = request.data.copy()
        serializer = self.get_serializer(data=request_data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            for field in list(e.detail):
                error_message = e.detail.get(field)[0]
                response_data = {
                    "error_message": f"{field}: {error_message}",
                    "user": None,
                    "token": None,
                }
                return Response(response_data, status=status.HTTP_200_OK)
        user = serializer.save()

        AuthToken.objects.filter(user=user).delete()
        response_data = {
            "error_message": None,
            "user": UserSerializer(user).data,
            "token": AuthToken.objects.create(user)[1],
            "user_permissions": get_all_user_permissions(user)
        }
        return Response(response_data, status=status.HTTP_200_OK)


class UpdateUserObject(generics.GenericAPIView):
    """
    Register a new user and return a token for the user.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        user_data = request.data.get("user_data")
        user = request.user

        for key, value in json.loads(user_data).items():
            if hasattr(user, key):
                setattr(user, key, value)

        user.save()
        response_data = {
            "error_message": None,
            "user": UserSerializer(user).data,
        }
        return Response(response_data, status=status.HTTP_200_OK)


class UserChangePassword(generics.GenericAPIView):
    """
    Change the password of a user and return a token for the user.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        user = authenticate(request,
                            username=request.user.username,
                            password=old_password)
        if user:
            user.set_password(new_password)
            user.save()
            AuthToken.objects.filter(user=user).delete()

            response_data = {
                "error_message": None,
                "user": UserSerializer(user).data,
                "token": AuthToken.objects.create(user)[1],
            }
            return Response(response_data, status=status.HTTP_200_OK)

        else:
            response_data = {
                "error_message": "Invalid old password",
                "user": None,
                "token": None,
            }
            return Response(response_data, status=status.HTTP_200_OK)


class GetCheckupLocation(generics.GenericAPIView):
    """
    Retrieve a list of checkup locations.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CheckupLocationSerializer

    def get(self, request, *args, **kwargs):
        locations = CheckupLocation.objects.filter()
        filters = request.GET.getlist("filters")
        locations = apply_filters(locations,  filters)
        response_data = {"checkup_locations": self.serializer_class(
            locations, many=True).data,
        }
        return Response(response_data)


class Adolescents(generics.GenericAPIView):
    """
    Retrieve a list of checkup locations.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AdolescentSerializer

    def get(self, request, *args, **kwargs):
        query = request.GET.get("query")
        filters = request.GET.getlist("filters")
        adolescents = Adolescent.objects.filter()
        if query:
            adolescents = adolescents.filter(
                Q(pid__icontains=query) |
                Q(surname__icontains=query) |
                Q(other_names__icontains=query)
            )
        adolescents = apply_filters(adolescents,  filters)

        response_data = {"adolescents": self.serializer_class(
            adolescents, context={"request": request}, many=True).data,
        }
        return Response(response_data)

    def post(self, request, *args, **kwargs):
        adolescent_data = request.data.get("adolescent_data")
        adolescent_data = json.loads(adolescent_data)
        dob = adolescent_data.pop("dob")
        dob = datetime.datetime.fromtimestamp(dob/1000.0)
        adolescent_data["dob"] = make_aware(dob)
        uuid = adolescent_data.pop("uuid")
        adolescent_data.pop("id")
        adolescent_data.pop("pid", None)

        adolescent, _ = Adolescent.objects.get_or_create(uuid=uuid)
        for key, value in adolescent_data.items():
            if hasattr(adolescent, key) and value:
                setattr(adolescent, key, value)
        adolescent.save()
        response_data = {
            "adolescent": AdolescentSerializer(adolescent, context={"request": request}).data,
            "error_message": "",
            "message": "Adolescent created successfully.",
        }
        return Response(response_data)


class UploadAdolescentPhoto(generics.GenericAPIView):
    """
    Retrieve a list of checkup locations.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AdolescentSerializer

    def post(self, request, *args, **kwargs):
        uuid = request.data.get("uuid")
        file = request.FILES.get("file")

        adolescent = Adolescent.objects.filter(uuid=uuid).first()
        if adolescent:
            adolescent.picture = file
            adolescent.save()
        else:
            return Response({}, 404)

        response_data = {
            "adolescent": AdolescentSerializer(adolescent, context={"request": request}).data,
            "error_message": "",
            "message": "Photo uploaded successfully.",
        }
        return Response(response_data)


class GetSurveyQuestions(generics.GenericAPIView):
    """
    Retrieve a list of checkup locations.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = QuestionSerialiser

    def get(self, request, *args, **kwargs):
        current_question_id = request.GET.get("current_question_id")
        adolescent_id = request.GET.get("adolescent_id")
        action = request.GET.get("action", "next")
        question_type = request.GET.get("question_type", "survey")

        adolescent = Adolescent.objects.filter(id=adolescent_id).first()
        if not adolescent:
            return Response({"error_message": "Adolescent not found."})

        # All available questions for this questionnaire type
        target_questions = Question.objects.filter(question_type=question_type)

        current_question = target_questions.filter(
            id=current_question_id).first()

        current_section = current_question.section if current_question else None
        if current_question:
            if action == "next":
                target_questions = target_questions.filter(
                    number__gt=current_question.number).order_by("number")
            else:
                target_questions = target_questions.filter(
                    number__lt=current_question.number).order_by("-number")
        else:
            target_questions = target_questions.order_by("number")

        # Filter out questions not meeting
        # depenpency requirements.
        invalid_questions_ids = []
        for question in target_questions:
            if not question.are_previous_response_conditions_met(
                    adolescent):
                invalid_questions_ids.append(question.id)

        question = target_questions.exclude(
            id__in=invalid_questions_ids).first()
        new_section = None
        if question and question.section != current_section:
            new_section = question.section

        response = AdolescentResponse.objects.filter(
            question=question, adolescent=adolescent).first()

        current_session_number = Section.objects.filter(
            question_type=question_type,
            number__lte=question.section.number).count() if question else 0
        total_sessions = Section.objects.filter(
            question_type=question_type,).count()

        response_data = {
            "question": QuestionSerialiser(question, context={"request": request}).data if question else None,
            "new_section": SectionSerialiser(new_section).data if new_section and action == "next" else None,
            "current_session_number": current_session_number,
            "total_sessions": total_sessions,
            "current_response": AdolescentResponseSerialiser(response).data if response else None,
        }
        return Response(response_data)


class RespondToSurveyQuestion(generics.GenericAPIView):
    """
    Retrieve a list of checkup locations.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ResponseSerialiser

    def post(self, request, *args, **kwargs):
        current_question_id = request.data.get("question_id")
        adolescent_id = request.data.get("adolescent_id")
        value = request.data.get("value")
        option_ids = list(map(int, request.data.getlist("option_ids")))

        adolescent = Adolescent.objects.filter(id=adolescent_id).first()
        if not adolescent:
            return Response({"error_message": "Adolescent not found."})

        current_question = Question.objects.filter(
            id=current_question_id).first()
        if not current_question:
            return Response({"error_message": "Question not found."})

        response, _ = AdolescentResponse.objects.get_or_create(
            question=current_question, adolescent=adolescent)

        if current_question.input_type in [ResponseInputType.TEXT_FIELD.value,
                                           ResponseInputType.NUMBER_FIELD.value,
                                           ResponseInputType.RANGER_SLIDER.value]:
            if not value:
                return Response({"error_message": "Simple value field is required."})
            response.text = value

        elif current_question.input_type in [ResponseInputType.CHECKBOXES.value,
                                             ResponseInputType.RADIO_BUTTON.value]:
            if not option_ids:
                return Response({"error_message": "Valid option ids are required."})

            options = Option.objects.filter(
                question=current_question, id__in=option_ids)
            response.chosen_options.set(options, clear=True)
        response.save()

        response_data = {
            "message": "Saved successfully",
            "success": True,
            "current_response": AdolescentResponseSerialiser(response).data,
        }
        return Response(response_data)


class GetAssessmentQuestions(generics.GenericAPIView):
    """
    Retrieve a list of checkup locations.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AdolescentSerializer

    def get(self, request, *args, **kwargs):
        current_question_id = ""
        adolescent = ""

        # Seearch next question (i.e, question with order greater than the curent_question)
        # based on current adolescent.

        # If the next question not within, the current section, return next section object and question object.

        # Else, return only the next question.

        response_data = {
            "question": None,
            "next_sectioin": None,
            "survey_completed": False,
        }
        return Response(response_data)
