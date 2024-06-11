import math
import logging
import statistics
from datetime import datetime
from collections import defaultdict
from celery import shared_task
from django.db.models import Prefetch
from dashboard.models import (
    Adolescent,
    AdolescentResponse,
    AdolescentActivityTime,
    ComputedAverageActivityTime,
    SummaryFlag,
)

logger = logging.getLogger(__name__)


@shared_task()
def compute_activity_average_time(start_time: datetime, end_time: datetime):
    adolescents = Adolescent.objects.filter(created_at__gte=start_time,
                                            created_at__lte=end_time)
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
                "Registration", "registration")].append(registration_duration)

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
                first_section_name,
                first_section_first_responses.question.section.question_type
            )].append(first_section_duration)

        # Subsequent sections
        section_last_response = first_section_last_response
        rem_responses = responses.filter(
            question__section__number__gt=first_section_last_response.question.
            section.number)
        while rem_responses.exists():
            section_start = section_last_response.created_at
            section_first_responses = rem_responses.first()
            section_name = section_first_responses.question.section.name
            section_responses = responses.filter(
                question__section__name=section_name)
            section_last_response = section_responses.last()
            section_end = section_last_response.created_at

            section_duration = (section_end - section_start).total_seconds()
            if section_duration > 0:
                adolescent_time_spent[(
                    section_name,
                    section_first_responses.question.section.question_type
                )].append(section_duration)

            rem_responses = responses.filter(
                question__section__number__gt=section_last_response.question.
                section.number)

        # Enter screening
        screening_duration = (section_end -
                              first_section_start).total_seconds()
        if screening_duration > 0:
            adolescent_time_spent[(
                "Total Screening Time",
                "total_screen_time")].append(screening_duration)

    # Average
    for (activity, key), times in adolescent_time_spent.items():
        # Remove outliers
        offset = math.ceil(0.1 * len(times))
        if len(times) > 2:
            times = list(sorted(times))[offset:-1 * offset]

        average = round(statistics.mean(times), 2)
        comp_key = f"{activity.replace(' ', '-').lower()}-{key}"
        comp_time = ComputedAverageActivityTime.objects.get_or_create(
            key=comp_key)[0]
        comp_time.activity = activity
        comp_time.average_time_in_seconds = average
        comp_time.save()
