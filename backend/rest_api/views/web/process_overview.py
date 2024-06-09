from collections import defaultdict
import math
import statistics
from rest_framework import generics, permissions
from rest_framework.response import Response
from django.utils import timezone
from django.utils.timezone import make_aware
from datetime import datetime

from serde import serde, to_dict
from ycheck.utils.constants import Colors
from dashboard.models import (
    Adolescent,
    AdolescentResponse,
    AdolescentActivityTime,
    SummaryFlag,
    Referral,
)


@serde
class ProcessActivity:
    activity: str
    key: str
    status: str
    average_time: float = 0
    required: bool = False


@serde
class FlagStatus:
    flag: str
    color: str
    status: str


class AdolescentActivityView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        adolescent_id = request.GET.get("adolescent_id")
        start_time = request.GET.get("start_time", "2023-01-01")
        end_time = request.GET.get("end_time",
                                    timezone.now().strftime('%Y-%m-%d'))
        start_time = make_aware(datetime.strptime(start_time, "%Y-%m-%d"))
        end_time = make_aware(datetime.strptime(end_time, "%Y-%m-%d"))

        adolescents = Adolescent.objects.filter(created_at__gte=start_time,
                                                created_at__lte=end_time)
        if adolescent_id:
            adolescents = adolescents.filter(id__in=adolescent_id)
        adolescent_time_spent = defaultdict(list)

        for adolescent in adolescents:
            responses = AdolescentResponse.objects.filter(
                adolescent=adolescent).order_by("created_at")
            activities = AdolescentActivityTime.objects.filter(
                adolescent=adolescent).order_by("timestamp")

            registration = activities.filter(
                activity_tag="adolescent_registration_start").first()
            adolescent_registration_start = adolescent.created_at
            if registration:
                adolescent_registration_start = registration.timestamp

            # Registration
            registration_duration = (
                adolescent.created_at -
                adolescent_registration_start).total_seconds()
            if registration_duration > 0:
                adolescent_time_spent[(
                    "Registration",
                    "registration")].append(registration_duration)

            # Get first station/section
            first_section_start = section_start = adolescent.created_at
            first_section_first_responses = responses.first()
            if not first_section_first_responses: continue
            first_section_name = first_section_first_responses.question.section.name
            first_section_responses = responses.filter(
                question__section__name=first_section_name)
            first_section_last_response = first_section_responses.last()
            first_section_end = section_end = first_section_last_response.created_at

            first_section_duration = (first_section_end -
                                      first_section_start).total_seconds()
            if first_section_duration > 0:
                adolescent_time_spent[(
                    first_section_name, first_section_first_responses.question.
                    section.question_type)].append(first_section_duration)

            # Subsequent sections
            section_last_response = first_section_last_response
            rem_responses = responses.filter(
                question__section__number__gt=first_section_last_response.
                question.section.number)
            while rem_responses.exists():
                section_start = section_last_response.created_at
                section_first_responses = rem_responses.first()
                section_name = section_first_responses.question.section.name
                section_responses = responses.filter(
                    question__section__name=section_name)
                section_last_response = section_responses.last()
                section_end = section_last_response.created_at

                section_duration = (section_end -
                                    section_start).total_seconds()
                if section_duration > 0:
                    adolescent_time_spent[(
                        section_name,
                        section_first_responses.question.section.question_type
                    )].append(section_duration)

                rem_responses = responses.filter(
                    question__section__number__gt=section_last_response.
                    question.section.number)

            # Enter screening
            screening_duration = (section_end -
                                  first_section_start).total_seconds()
            if screening_duration > 0:
                adolescent_time_spent[(
                    "Total Screening Time",
                    "total_screen_time")].append(screening_duration)

        # Average
        activities = []
        for (activity, key), times in adolescent_time_spent.items():
            # Remove outliers
            offset = math.ceil(0.1 * len(times))
            if len(times) > 2:
                times = list(sorted(times))[offset:-1 * offset]

            average = round(statistics.mean(times), 2)
            activities.append(
                to_dict(ProcessActivity(activity, key, "completed", average)))

        response_data = {"activities": activities}
        return Response(response_data)


class AdolescentFlagCheckView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pid, *args, **kwargs):
        flags = SummaryFlag.objects.filter(
            adolescent__pid=pid).order_by("label__name")
        results = []
        for flag in flags:
            status = "normal"
            if flag.final_color_code == Colors.RED.value:
                referrals = Referral.objects.filter(
                    adolescent=flag.adolescent,
                    services__related_flag_labels=flag.label)

                status = "pending" if not referrals.exists() else "referred"

            results.append(
                to_dict(
                    FlagStatus(flag.label.name, flag.final_color_code,
                               status)))

        response_data = {"flags": results}
        return Response(response_data)


class UpdateAdolescentStatus(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pid, *args, **kwargs):
        status = request.data.get("status")
        adolescent = Adolescent.objects.filter(pid=pid).first()
        if adolescent:
            adolescent.process_status = status
            adolescent.save()
            response_data = {"message": "Updated successfully"}
            return Response(response_data)
        else:
            response_data = {"error_message": "Failed to Update"}
            return Response(response_data)
