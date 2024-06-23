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
from .utils import get_demographic_data,get_age_distribution_data
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
        colors = [Colors.GREEN, Colors.RED, Colors.ORANGE]
        result = {}
        for condition in FlagLabel.objects.all():
            dist = {}
            for color in colors:
                flags = SummaryFlag.objects.filter(
                    final_color_code=color.value, label=condition)
                dist[color.name] = flags.count()
            result[condition.name] = dist

        response_data = {"flag_distribution": result}
        return Response(response_data)


class GetAdolescentType(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]

    @method_decorator(cache_page(60 * 2))
    def get(self, request, format=None):

        # BASIC
        basic_count = Adolescent.objects.filter(type="basic").count()

        # SECONDARY
        secondary_count = Adolescent.objects.filter(type="secondary").count()

        # COMMUNITY
        community_count = Adolescent.objects.filter(type="community").count()

        # TOTAL ADOLESCENTS
        total_adolescent_count = Adolescent.objects.all().count()

        # TOTAL USERS
        total_user_count = User.objects.all().count()

        # TOTAL TREATMENTS
        total_treatment_count = Treatment.objects.all().count()

        # TOTAL REFERRALS
        total_referral_count = Referral.objects.all().count()

        # TOTAL SERVICES
        total_service_count = Service.objects.all().count()

        # TOTAL FACILITIES
        total_facility_count = Facility.objects.all().count()

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