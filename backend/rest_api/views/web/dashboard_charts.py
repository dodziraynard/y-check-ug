import math
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_api.permissions import APILevelPermissionCheck
from rest_api.serializers import *
from django.db.models import Count
from dashboard.forms import *
from rest_api.views.mixins import QUERY_PAGE_SIZE
from dashboard.models import *
from rest_framework import generics
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from .types import FlagStatus
from .utils import get_demographic_data, get_age_distribution_data, get_completed_treatment
from django.db.models import Count, F
from dateutil.parser import parse
from django.utils import timezone
from django.utils.timezone import make_aware

logger = logging.getLogger(__name__)


def get_color_name(color_code):
    for color in Colors:
        if color.value == color_code:
            return color.name
    return None


def to_dict(flag_status, adolescent_pid):
    return {
        "adolescent_pid": adolescent_pid,
        "flag": flag_status.flag,
        "final_color_code": get_color_name(flag_status.final_color_code),
        "computed_color_code": get_color_name(flag_status.computed_color_code),
    }


def _get_date(date):
    if date:
        return make_aware(parse(date))


class AllAdolescentsFlagCheckView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(cache_page(60 * 2))
    def get(self, request, *args, **kwargs):
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        page = request.GET.get("page", "1")

        page = int(page) if page.isnumeric() else 1

        page_size = request.GET.get("page_size", "")
        page_size = int(
            page_size) if page_size.isnumeric() else QUERY_PAGE_SIZE

        all_results = []
        all_flags = SummaryFlag.objects.order_by('adolescent__pid',
                                                 "label__name")
        flags = all_flags[(page - 1) * page_size:page * page_size]

        for flag in flags:
            all_results.append(
                to_dict(
                    FlagStatus(flag.label.name, flag.final_color_code,
                               flag.computed_color_code), flag.adolescent.pid))

        total_pages = max(1, math.ceil(all_flags.count() / page_size))
        if page > total_pages:
            page = total_pages
        page = max(page, 1)

        prev_page = page - 1 if page > 1 else None
        next_page = page + 1 if total_pages > page else None

        response_data = {
            "adolescents": all_results,
            "page": page,
            "page_size": page_size,
            "total": all_flags.count(),
            "next_page": next_page,
            "previous_page": prev_page,
            "total_pages": total_pages,
        }
        return Response(response_data)


class FlagColourDistributionView(generics.GenericAPIView):

    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(cache_page(60 * 2))
    def get(self, request, *args, **kwargs):
        start_date = _get_date(request.GET.get("start_date"))
        end_date = _get_date(request.GET.get("end_date"))

        colors = [Colors.GREEN, Colors.RED, Colors.ORANGE]
        result = {}
        for condition in FlagLabel.objects.all():
            dist = {}
            for color in colors:
                flags = SummaryFlag.objects.filter(
                    final_color_code=color.value, label=condition)
                if start_date:
                    flags = flags.filter(
                        adolescent__created_at__gte=start_date)
                if end_date:
                    flags = flags.filter(adolescent__created_at__lte=end_date)
                dist[color.name] = flags.count()
            result[condition.name] = dist

        response_data = {"flag_distribution": result}
        return Response(response_data)


class GetAdolescentType(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]

    @method_decorator(cache_page(60 * 2))
    def get(self, request, format=None):
        start_date = _get_date(request.GET.get("start_date")) or make_aware(
            datetime(2023, 1, 1))
        end_date = _get_date(request.GET.get("end_date")) or timezone.now()

        adolescents = Adolescent.objects.filter(created_at__gte=start_date,
                                                created_at__lte=end_date)

        # BASIC
        basic_count = adolescents.filter(type="basic").count()

        # SECONDARY
        secondary_count = adolescents.filter(type="secondary").count()

        # COMMUNITY
        community_count = adolescents.filter(type="community").count()

        # TOTAL ADOLESCENTS
        total_adolescent_count = adolescents.all().count()

        # TOTAL USERS
        total_user_count = User.objects.all().count()

        # TOTAL TREATMENTS
        total_treatment_count = Treatment.objects.filter(
            adolescent__created_at__gte=start_date,
            adolescent__created_at__lte=end_date,
        ).count()

        # TOTAL REFERRALS
        total_referral_count = Referral.objects.filter(
            adolescent__created_at__gte=start_date,
            adolescent__created_at__lte=end_date,
        ).count()

        # TOTAL SERVICES
        total_service_count = Service.objects.filter().count()

        # TOTAL FACILITIES
        total_facility_count = Facility.objects.filter().count()

        return Response({
            "basic": basic_count,
            "secondary": secondary_count,
            "community": community_count,
            "total_adolescent": total_adolescent_count,
            "total_user": total_user_count,
            "total_referal": total_referral_count,
            "total_treatment": total_treatment_count,
            "total_service": total_service_count,
            "total_facility": total_facility_count,
        })


class BasicDemographics(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(cache_page(60 * 2))
    def get(self, request, format=None):
        response_data = get_demographic_data(adolescent_type="basic")
        return Response({"basic_demographics": response_data})


class SecondaryDemographics(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(cache_page(60 * 2))
    def get(self, request, format=None):
        response_data = get_demographic_data(adolescent_type="secondary")
        return Response({"secondary_demographics": response_data})


class CommunityDemographics(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(cache_page(60 * 2))
    def get(self, request, format=None):
        response_data = get_demographic_data(adolescent_type="community")
        return Response({"community_demographics": response_data})


class AgeDistributionDemographics(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(cache_page(60 * 2))
    def get(self, request, format=None):
        response_data = get_age_distribution_data()
        return Response({"age_distributions": response_data})


class PositiveScreenedView(generics.GenericAPIView):
    """ get all positive screened and to be treated onsite flags"""

    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(cache_page(60 * 2))
    def get(self, request, *args, **kwargs):
        red_flag_code = Colors.RED.value
        categories = ["basic", "secondary", "community"]
        result = []

        referrals = Referral.objects.filter(is_onsite=True).select_related(
            'adolescent').prefetch_related('services__related_flag_labels')
        onsite_adolescents = {referral.adolescent for referral in referrals}

        for label in FlagLabel.objects.all():
            red_flags = SummaryFlag.objects.filter(
                final_color_code=red_flag_code, label=label)
            category_counts = {
                category: red_flags.filter(adolescent__type=category).count()
                for category in categories
            }
            total_red_flags = sum(category_counts.values())
            if total_red_flags > 0:
                result.append({
                    "name": label.name,
                    "total": total_red_flags,
                    **category_counts
                })

        # Sort red_flag_distribution by name
        result = sorted(result, key=lambda x: x["name"])

        # Aggregate data for each flag label
        to_be_treated_onsite = []
        flag_label_distribution = {
            label.name: {
                category.lower(): 0
                for category in categories
            }
            for label in FlagLabel.objects.all()
        }
        for referral in referrals:
            for service in referral.services.all():
                for flag_label in service.related_flag_labels.all():
                    flag_label_distribution[flag_label.name][(
                        referral.adolescent.type or "").lower()] += 1

        for flag_label, counts in flag_label_distribution.items():
            total = sum(counts.values())
            if total > 0:
                to_be_treated_onsite.append({
                    "name": flag_label,
                    "total": total,
                    **counts
                })

        to_be_treated_onsite = sorted(to_be_treated_onsite,
                                      key=lambda x: x["name"])

        response_data = {
            "red_flag_distribution": result,
            "to_be_treated_onsite": to_be_treated_onsite
        }

        return Response(response_data)


class TreatedOnsiteView(generics.GenericAPIView):

    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(cache_page(60 * 2))
    def get(self, request, *args, **kwargs):

        response_data = get_completed_treatment(is_onsite=True,
                                                status="completed")
        return Response({"treated_onsite": response_data})


class ReferredForTreatedView(generics.GenericAPIView):

    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(cache_page(60 * 2))
    def get(self, request, *args, **kwargs):
        red_flag_code = Colors.RED.value
        categories = ["basic", "secondary", "community"]

        referrals = Referral.objects.filter(is_onsite=False).select_related(
            'adolescent').prefetch_related('services__related_flag_labels')
        onsite_adolescents = {referral.adolescent for referral in referrals}

        referred_for_treatment = []
        flag_label_distribution = {
            label.name: {
                category: 0
                for category in categories
            }
            for label in FlagLabel.objects.all()
        }
        for referral in referrals:
            for service in referral.services.all():
                for flag_label in service.related_flag_labels.all():
                    flag_label_distribution[flag_label.name][
                        referral.adolescent.type] += 1

        for flag_label, counts in flag_label_distribution.items():
            total = sum(counts.values())
            if total > 0:
                referred_for_treatment.append({
                    "name": flag_label,
                    "total": total,
                    **counts
                })

        # Sort referred_for_treatment by name
        referred_for_treatment = sorted(referred_for_treatment,
                                        key=lambda x: x["name"])

        response_data = {"referred_for_treatment": referred_for_treatment}

        return Response(response_data)


class ReferredAndTreatedView(generics.GenericAPIView):

    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(cache_page(60 * 2))
    def get(self, request, *args, **kwargs):

        response_data = get_completed_treatment(is_onsite=False,
                                                status="completed")
        return Response({"referred_and_treated": response_data})


class FeedbackQuestion(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):

        question_id = "Q1200"
        question = Question.objects.get(question_id=question_id)

        # Fetch all responses for this question
        responses = AdolescentResponse.objects.filter(
            question=question).annotate(
                adolescent_type=F('adolescent__type'),
                response_value=F('chosen_options__value'))

        # Group by adolescent type and response option, and count them
        stats = responses.values('adolescent_type',
                                 'response_value').annotate(count=Count('id'))

        # Total counts per adolescent type
        total_counts = responses.values('adolescent_type').annotate(
            total=Count('id'))

        # Unique response values
        unique_responses = list(
            responses.values_list('response_value', flat=True).distinct())

        # Initialize the results dictionary dynamically
        result = {
            "basic": {
                response: 0
                for response in unique_responses + ["Total"]
            },
            "community": {
                response: 0
                for response in unique_responses + ["Total"]
            },
            "secondary": {
                response: 0
                for response in unique_responses + ["Total"]
            },
            "Total": {
                response: 0
                for response in unique_responses + ["Total"]
            }
        }

        # Populate the result dictionary with counts and percentages
        for stat in stats:
            adolescent_type = stat['adolescent_type']
            response_value = stat['response_value']
            count = stat['count']

            # Update counts
            result[adolescent_type][response_value] = count
            result[adolescent_type]["Total"] += count
            result["Total"][response_value] += count
            result["Total"]["Total"] += count

        # Calculate percentages
        for key in ["basic", "community", "secondary", "Total"]:
            total = result[key]["Total"]
            if total > 0:
                for response in unique_responses:
                    count = result[key][response]
                    percentage = (count / total) * 100
                    result[key][response] = f"{count} ({percentage:.1f}%)"
                result[key]["Total"] = f"{total} (100.0%)"

        # Transform the result into the desired format
        final_result = {"responses": []}
        for response in unique_responses:
            row = {
                "options": response,
                "Basic": result["basic"][response],
                "Community": result["community"][response],
                "Secondary": result["secondary"][response],
                "Total": result["Total"][response]
            }
            final_result["responses"].append(row)

        # Calculate and append the total row
        total_row = {
            "options": "Total",
            "Basic": f"{result['basic']['Total']}",
            "Community": f"{result['community']['Total']}",
            "Secondary": f"{result['secondary']['Total']}",
            "Total": f"{result['Total']['Total']}"
        }
        final_result["responses"].append(total_row)

        return Response(final_result)
