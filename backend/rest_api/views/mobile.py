import datetime
import json
import logging
import sys
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
from dashboard.models import (
    Adolescent,
    CheckupLocation,
    AdolescentResponse,
    Option,
    AdolescentActivityTime)

from rest_api.serializers import (CheckupLocationSerializer,
                                  AdolescentSerializer,
                                  QuestionSerializer,
                                  SectionSerializer,
                                  ResponseSerialiser,
                                  AdolescentResponseSerialiser,
                                  MobileConfigSerializer,
                                  RegisterSerializer,
                                  UserSerializer)

logger = logging.getLogger(__name__)


class MobileConfigAPI(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        config, _ = MobileConfig.objects.get_or_create()
        config = MobileConfigSerializer(config).data
        logger.debug("HRDDDDDD")
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
        pid = adolescent_data.get("pid")

        if not pid:
            response_data = {
                "error_message": f"Invalid PID '{pid}'"
            }
            return Response(response_data)

        adolescent = None
        try:
            adolescent, _ = Adolescent.objects.get_or_create(uuid=uuid)
            for key, value in adolescent_data.items():
                if hasattr(adolescent, key) and value:
                    setattr(adolescent, key, value)
            if adolescent.pid == "" or adolescent.pid == None:
                adolescent.delete()
            else:
                adolescent.save()
        except Exception as e:
            logger.error(
                "Error occured while adding/updating adolescent: %s", str(e))

            if adolescent != None and (adolescent.pid == "" or adolescent.pid == None):
                adolescent.delete()

            error_message = f"Error: {str(e)}"
            if "UNIQUE" in str(e).upper():
                error_message = "PID already exists."
                Adolescent.objects.filter(pid=None).delete()
                Adolescent.objects.filter(pid="").delete()

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
            (Q(study_phase=None) | Q(study_phase__iexact=adolescent.study_phase))
        )

        current_question = target_questions.filter(
            id=current_question_id).first()

        current_section = current_question.section if current_question else None
        if current_question:
            if action == "next_unanswered":
                target_questions = target_questions.exclude(
                    adolescentresponse__adolescent=adolescent)

            if action in ["next", "next_unanswered"]:
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
            "question": QuestionSerializer(question, context={"request": request, "adolescent": adolescent}).data if question else None,
            "new_section": SectionSerializer(new_section).data if new_section and action == "next" else None,
            "current_session_number": current_session_number,
            "total_sessions": total_sessions,
            "current_response": AdolescentResponseSerialiser(response, context={"request": request}).data if response else None,
        }
        return Response(response_data)


class GetNextAvailableQuestions(generics.GenericAPIView):
    """
    Returns the list of questions whose dependency conditions are already satisfied.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = QuestionSerializer

    def get(self, request, *args, **kwargs):
        current_question_id = request.GET.get("current_question_id")
        adolescent_id = request.GET.get("adolescent_id")
        max_questions = int(request.GET.get("max_questions", 10))
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
            (Q(study_phase=None) | Q(study_phase__iexact=adolescent.study_phase))
        )

        current_question = target_questions.filter(
            id=current_question_id).first()

        current_section: Section = current_question.section if current_question else None
        if current_question:
            if action == "next_unanswered":
                target_questions = target_questions.exclude(
                    responses__adolescent=adolescent)

            if action in ["next", "next_unanswered"]:
                target_questions = target_questions.filter(
                    number__gt=current_question.number).order_by("number")
            else:
                target_questions = target_questions.filter(
                    number__lt=current_question.number).order_by("number")
        else:
            target_questions = target_questions.order_by("number")

        # Filter out questions not meeting depenpency requirements.
        invalid_questions_ids = set()
        last_invalid_question_number = sys.maxsize
        for index, question in enumerate(target_questions):
            # Check age requirements
            if question.min_age and adolescent.get_age() < question.min_age:
                invalid_questions_ids.add(question.id)
                continue
            if question.max_age and adolescent.get_age() > question.max_age:
                invalid_questions_ids.add(question.id)
                continue

            if not question.are_previous_response_conditions_met(
                    adolescent):

                # If we have questions to answer i.e., index > len(invalid_questions_ids)
                # and 'question' is not eligible,

                if index > len(invalid_questions_ids) and action in ["next", "next_unanswered"]:
                    last_invalid_question_number = question.number
                    # stop and answer those eligible questions.
                    break
                invalid_questions_ids.add(question.id)

        questions = target_questions.exclude(
            Q(id__in=invalid_questions_ids) | Q(number__gte=last_invalid_question_number))
        new_section = None
        first_question = questions.first()
        if first_question and first_question.section != current_section:
            new_section = first_question.section

        # Only show questions from same section at once.
        questions = questions.filter(section=new_section or current_section)[
            :max_questions]
        if questions.exists():
            responses = AdolescentResponse.objects.filter(question__in=questions,
                                                          adolescent=adolescent)
            current_section_number = Section.objects.filter(
                question_type=question_type,
                number__lte=first_question.section.number).count() if question else 0
        else:
            current_section_number = 0
            responses = AdolescentResponse.objects.none()

        total_sessions = Section.objects.filter(
            question_type=question_type).count()

        # Community adolescents have only 10 sesions.
        if adolescent.type == "community":
            total_sessions = min(total_sessions, 10)

        response_data = {
            "questions": QuestionSerializer(questions, context={"request": request, "adolescent": adolescent}, many=True).data if questions else None,
            "new_section": SectionSerializer(new_section).data if new_section and action == "next" else None,
            "current_section_number": current_section_number,
            "total_sessions": total_sessions,
            "current_responses": AdolescentResponseSerialiser(responses, context={"request": request}, many=True).data if responses else None,
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


class PostMutipleResponses(generics.GenericAPIView):
    """
    Post responses to multiple questions.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ResponseSerialiser

    def post(self, request, *args, **kwargs):
        adolescent_id = request.data.get("adolescent_id")
        question_responses_json = request.data.get("question_responses_json")
        last_answered_question = None
        for current_question_id, responses in json.loads(question_responses_json).items():
            value = responses.get("first")
            option_ids = responses.get("second")

            adolescent = Adolescent.objects.filter(id=adolescent_id).first()
            if not adolescent:
                return Response({"error_message": "Adolescent not found."})

            current_question = Question.objects.filter(
                id=current_question_id).first()
            if not current_question:
                return Response({"error_message": "Question not found."})
            elif not last_answered_question:
                last_answered_question = current_question
            elif last_answered_question.number < current_question.number:
                last_answered_question = current_question

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
            "last_answered_question_id": last_answered_question.id if last_answered_question else "-1",
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


class RecordAdolescentActivityTime(generics.GenericAPIView):
    """
    Record the time an adolescent reaches a station.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        adolescent_id = request.data.get("adolescent_id")
        timestamp = request.data.get("timestamp")
        activity_tag = request.data.get("activity_tag")

        timestamp = make_aware(
            datetime.datetime.fromtimestamp(float(timestamp)/1000.0))

        adolescent = Adolescent.objects.filter(id=adolescent_id).first()
        if not adolescent:
            return Response({"error_message": "Adolescent not found."})

        if not (activity_tag and timestamp):
            return Response({"error_message": "activity_tag and timestamp are required."})

        activity_record = AdolescentActivityTime.objects.filter(
            adolescent=adolescent,
            activity_tag=activity_tag
        ).first()
        if not activity_record:
            AdolescentActivityTime.objects.create(
                adolescent=adolescent,
                timestamp=timestamp,
                activity_tag=activity_tag
            )
        else:
            activity_record.timestamp = timestamp
            activity_record.save()

        response_data = {
            "message": "Time recorded"
        }
        return Response(response_data)
