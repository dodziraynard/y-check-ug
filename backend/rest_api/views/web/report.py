import logging
from django.urls import reverse
from rest_framework import generics
from datetime import datetime
from django.utils import timezone
from django.utils.timezone import make_aware
from rest_framework.response import Response
from django.conf import settings
from pdf_processor.tasks import (
    generate_table_5_report,
    generate_table_1_report,
    generate_referral_stats_report,
)

logger = logging.getLogger(__name__)


class TableReportsView(generics.GenericAPIView):
    permission_required = [
        "setup.generate_report",
    ]

    def get(self, request, table_number):
        from_date = request.GET.get("from_date") or make_aware(
            datetime(2023, 1, 1))  # since project started in 2023
        to_date = request.GET.get("to_date") or timezone.now()

        if isinstance(from_date, str):
            from_date = make_aware(datetime.strptime(from_date, '%Y-%m-%d'))
        if isinstance(to_date, str):
            to_date = make_aware(datetime.strptime(to_date, '%Y-%m-%d'))

        task_id, error_message = None, None
        filename = f"y-check-report-table-{table_number}-{from_date.strftime('%m-%d-%Y')}-{to_date.strftime('%m-%d-%Y')}.pdf"
        match table_number:
            case 0:
                task_id = generate_referral_stats_report.delay(
                    filename, from_date, to_date)
            case 1:
                task_id = generate_table_1_report.delay(
                    filename, from_date, to_date)
            case 5:
                task_id = generate_table_5_report.delay(
                    filename, from_date, to_date)
            case _:
                error_message = f"Report for table {table_number} not available."

        task_id = str(task_id) if task_id else None
        if not task_id:
            return Response({
                "error_message": error_message if error_message else "Couldn't start report generation task."
            })

        download_link = settings.TEMP_REPORT_URL + filename
        response_data = {
            "task_id": task_id,
            "download_link": request.build_absolute_uri(download_link),
            "sse_status_url": request.build_absolute_uri(reverse("dashboard:stream_task_status", args=[task_id]))
        }
        return Response(response_data)
