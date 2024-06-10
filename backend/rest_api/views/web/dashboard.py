import math
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_api.serializers import *
from dashboard.forms import *
from rest_api.views.mixins import QUERY_PAGE_SIZE
from dashboard.models import *
from rest_framework import generics
from django.db.models import Q
from django.db.models import Prefetch
from .types import FlagStatus

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

    def get(self, request, *args, **kwargs):
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        page = request.GET.get("page", "1")

        page = int(page) if page.isnumeric() else 1

        page_size = request.GET.get("page_size", "")
        page_size = int(
            page_size) if page_size.isnumeric() else QUERY_PAGE_SIZE

        # Get all adolescents
        adolescents = Adolescent.objects.all().prefetch_related(
            Prefetch('summaryflag_set',
                     queryset=SummaryFlag.objects.order_by('label__name')))

        all_results = []
        for adolescent in adolescents:
            flags = adolescent.summaryflag_set.all()
            for flag in flags:
                all_results.append(
                    to_dict(
                        FlagStatus(flag.label.name, flag.final_color_code,
                                   flag.computed_color_code), adolescent.pid))

        total_pages = max(1, math.ceil(len(all_results) / page_size))
        if page > total_pages:
            page = total_pages
        page = max(page, 1)

        paginated_result = all_results[(page - 1) * page_size:page * page_size]

        prev_page = page - 1 if page > 1 else None
        next_page = page + 1 if total_pages > page else None

        response_data = {
            "adolescents": paginated_result,
            "page": page,
            "page_size": page_size,
            "total": len(all_results),
            "next_page": next_page,
            "previous_page": prev_page,
            "total_pages": total_pages,
        }
        return Response(response_data)


class FlagColourDistributionView(generics.GenericAPIView):

    permission_classes = [permissions.IsAuthenticated]

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
