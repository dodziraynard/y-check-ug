from rest_framework import generics
from .utils import render_to_pdf
from django.shortcuts import HttpResponse
from collections import namedtuple
from dashboard.models import Adolescent, FlagLabel, SummaryFlag
from datetime import datetime
from django.utils import timezone
from django.utils.timezone import make_aware
from ycheck.utils.constants import Colors


Table5RowTotal = namedtuple(
    "Table5RowTotal", "male_14, female_14, male_19, female_19")
Table5RowValue = namedtuple(
    "Table5RowValue", "condition, male_14, female_14, male_19, female_19")


class Table5ReportView(generics.GenericAPIView):
    template_name = "pdf_processor/table_5.html"
    permission_required = [
        "setup.generate_report",
    ]

    def get(self, request):
        from_date = request.GET.get("from_date") or make_aware(
            datetime(2023, 1, 1))  # project started in 2023
        to_date = request.GET.get("to_date") or timezone.now()

        age_14 = 14
        age_19 = 19
        rows = []
        conditions = FlagLabel.objects.all().order_by("name")

        # Total
        total_male_14 = Adolescent.objects.filter(
            created_at__gte=from_date,
            created_at__lte=to_date,
            age__lte=age_14,
            gender="male"
        ).count()
        total_male_19 = Adolescent.objects.filter(
            created_at__gte=from_date,
            created_at__lte=to_date,
            age__gt=age_14,
            age__lte=age_19,
            gender="male"
        ).count()
        total_female_14 = Adolescent.objects.filter(
            created_at__gte=from_date,
            created_at__lte=to_date,
            age__lte=age_14,
            gender="female"
        ).count()
        total_female_19 = Adolescent.objects.filter(
            created_at__gte=from_date,
            created_at__lte=to_date,
            age__gt=age_14,
            age__lte=age_19,
            gender="female"
        ).count()
        totals = Table5RowTotal(
            total_male_14, total_female_14, total_male_19, total_female_19)

        for condition in conditions:
            flags = SummaryFlag.objects.filter(
                label=condition,
                adolescent__created_at__gte=from_date,
                adolescent__created_at__lte=to_date,
                final_color_code=Colors.RED.value,
            )

            male_14 = flags.filter(
                adolescent__age__lte=age_14,
                adolescent__gender="male",
            ).count()

            male_19 = flags.filter(
                adolescent__age__gt=age_14,
                adolescent__age__lte=age_19,
                adolescent__gender="male",
            ).count()

            female_14 = flags.filter(
                adolescent__age__lte=age_14,
                adolescent__gender="female",
            ).count()

            female_19 = flags.filter(
                adolescent__age__gt=age_14,
                adolescent__age__lte=age_19,
                adolescent__gender="female",
            ).count()

            rows.append(
                Table5RowValue(
                    condition.name,
                    f"{male_14} ({round(male_14/max(1, totals.male_14)*100, 1)}%)",
                    f"{female_14} ({round(female_14/max(1, totals.female_14)*100, 1)}%)",
                    f"{male_19} ({round(male_19/max(1, totals.male_19)*100, 1)}%)",
                    f"{female_19} ({round(female_19/max(1, totals.female_19)*100, 1)}%)",
                )
            )

        context = {
            "totals": totals,
            "rows": rows,
            "total_adolescent": sum(totals)
        }
        pdf = render_to_pdf(self.template_name, context)
        if pdf:
            response = HttpResponse(pdf, content_type='application/pdf')
            filename = "y-check-report-table-5.pdf"
            content = "inline; filename=%s" % (filename)
            download = request.GET.get("download")
            if download:
                content = "attachment; filename=%s" % (filename)
            response['Content-Disposition'] = content
            return response
        return HttpResponse("Not found", status=404)
