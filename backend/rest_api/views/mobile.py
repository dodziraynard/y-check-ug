import datetime
import json
import logging
from django.utils.timezone import make_aware

from django.contrib.auth import authenticate
from knox.models import AuthToken
from django.db.models import Q
from setup.models import MobileConfig
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from ycheck.utils.constants import ResponseInputType
from dashboard.models import Question, Section
from ycheck.utils.functions import apply_filters
from dashboard.models import Adolescent, CheckupLocation, AdolescentResponse, Option

from rest_api.serializers import (CheckupLocationSerializer,
                                  AdolescentSerializer,
                                  QuestionSerializer,
                                  SectionSerializer,
                                  ResponseSerialiser,
                                  AdolescentResponseSerialiser,
                                  MobileConfigSerializer,
                                  RegisterSerializer,
                                  UserSerializer)

logger = logging.getLogger("app")


class MobileConfigAPI(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        config, _ = MobileConfig.objects.get_or_create()
        config = MobileConfigSerializer(config).data
        return Response({'config': config}, status=status.HTTP_200_OK)


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


class MobileAdolescentsAPI(generics.GenericAPIView):
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

        try:
            adolescent, _ = Adolescent.objects.get_or_create(uuid=uuid)
            for key, value in adolescent_data.items():
                if hasattr(adolescent, key) and value:
                    setattr(adolescent, key, value)
            adolescent.save()
        except Exception as e:
            logger.error("Error occured while adding/updating adolescent: ", str(e))

            error_message = f"Error: {str(e)}"
            if "UNIQUE" in str(e):
                error_message = "PID already exists."
            response_data = {
                "error_message": error_message,
                "message": "",
                "adolescent": None,
            }
        else:
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
    serializer_class = QuestionSerializer

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

        # Filter questions for adolescent attributes
        target_questions = target_questions.filter(
            (Q(gender=None) | Q(gender__iexact=adolescent.gender)) &
            (
                # Adolescent type is not required
                Q(adolescent_type=None) |

                # OR
                (
                    # Or required type is set and not invertted
                    Q(adolescent_type__iexact=adolescent.type) & Q(invert_adolescent_attribute_requirements=False) |

                    # Or required type is set and invertted
                    ~Q(adolescent_type__iexact=adolescent.type) & Q(
                        invert_adolescent_attribute_requirements=True)
                )
            ) &
            (Q(type_of_visit=None) | Q(type_of_visit__iexact=adolescent.visit_type))
        )

        current_question = target_questions.filter(
            id=current_question_id).first()

        current_section = current_question.section if current_question else None
        if current_question:
            if action == "next_answered":
                target_questions = target_questions.exclude(adolescentresponse__adolescent=adolescent)

            if action in ["next", "next_answered"]:
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

            # Check age requirements
            if question.min_age and adolescent.get_age() < question.min_age:
                invalid_questions_ids.append(question.id)
            if question.max_age and adolescent.get_age() > question.max_age:
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

        # Community adolescents have only 10 sesions.
        if adolescent.type == "community":
            total_sessions = min(total_sessions, 10)

        response_data = {
            "question": QuestionSerializer(question, context={"request": request}).data if question else None,
            "new_section": SectionSerializer(new_section).data if new_section and action == "next" else None,
            "current_session_number": current_session_number,
            "total_sessions": total_sessions,
            "current_response": AdolescentResponseSerialiser(response, context={"request": request}).data if response else None,
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
        option_ids = request.data.getlist("option_ids")

        adolescent = Adolescent.objects.filter(id=adolescent_id).first()
        if not adolescent:
            return Response({"error_message": "Adolescent not found."})

        current_question = Question.objects.filter(
            id=current_question_id).first()
        if not current_question:
            return Response({"error_message": "Question not found."})

        try:
            response, _ = AdolescentResponse.objects.get_or_create(
                question=current_question, adolescent=adolescent)
        except AdolescentResponse.MultipleObjectsReturned:
            AdolescentResponse.objects.filter(
                question=current_question, adolescent=adolescent).delete()
            response = AdolescentResponse.objects.create(
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


class GetSchoolsAPI(generics.GenericAPIView):
    """
    Retrieve a list of schools.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        type = request.GET.get("type")
        locations = CheckupLocation.objects.exclude(
            type="community").order_by("name")

        if type:
            locations = locations.filter(type=type)

        schools = [location.name for location in locations]

        response_data = {
            "schools": schools,
        }
        return Response(response_data)
