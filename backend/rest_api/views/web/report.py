import logging
from django.urls import reverse
from rest_framework import generics
from datetime import datetime
from django.utils import timezone
from django.utils.timezone import make_aware
from pdf_processor.tasks import generate_table_5_report
from rest_framework.response import Response
from django.conf import settings


logger = logging.getLogger(__name__)


class TableReportsView(generics.GenericAPIView):
    permission_required = [
        "setup.generate_report",
    ]

    def get(self, request, table_number):
        from_date = request.GET.get("from_date") or make_aware(
            datetime(2023, 1, 1))  # since project started in 2023
        to_date = request.GET.get("to_date") or timezone.now()

        task_id, error_message = None, None
        filename = f"y-check-report-table-{table_number}.pdf"
        match table_number:
            case 5:
                task_id = generate_table_5_report.delay(
                    filename, from_date, to_date)
                task_id = str(task_id) if task_id else None
            case _:
                error_message = f"Report for table {table_number} not available."

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
