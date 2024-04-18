"""
This module is responsible for processing files using the celery worker
"""
import logging
from datetime import datetime
from typing import List
from pdf_processor.utils import render_to_pdf_file
from django.conf import settings
from celery import shared_task
from collections import namedtuple
from django.utils import timezone
from dashboard.models import Adolescent, CheckupLocation, Question
from django.utils.timezone import make_aware
from pdf_processor.utils import set_task_state

logger = logging.getLogger(__name__)

Table1RowValue = namedtuple(
    "Table1RowValue", "name, value_1, value_2, value_3, value_4")


@shared_task(bind=True)
def generate_table_1_report(self, filename="report.pdf", from_date=None, to_date=None):
    template_name = "pdf_processor/table_1.html"

    # Validate from and to dates.
    if not isinstance(from_date, datetime):
        from_date = make_aware(datetime(2023, 1, 1))
    if not isinstance(to_date, datetime):
        to_date = timezone.now()

    adolescents = Adolescent.objects.filter(
        created_at__gte=from_date,
        created_at__lte=to_date,
    )
    set_task_state(self, "RETRIEVING RECORDS", 1,
                   info=f"Retrieving invoice data.")

    # Total
    basic_total, secondary_total, community_total = [
        adolescents.filter(type=t).count() for t in ["basic", "secondary", "community"]
    ]
    rows: List[Table1RowValue] = []
    locations = CheckupLocation.objects.all().values_list("name", flat=True)
    for field, title, values in [
        ("age", "Age in years", range(10, 20)),
        ("gender", "Sex", ["male", "female"]),
            ("check_up_location", "Location", locations)]:
        for i, value in enumerate(values):
            adoles = adolescents.filter(**{field: value})
            name = title if i == 0 else ""
            value_2, value_3, value_4 = [adoles.filter(type=t).count() for t in [
                "basic", "secondary", "community"]]
            rows.append(
                Table1RowValue(
                    name,
                    str(value).title(),
                    f"{value_2} ({round(value_2/max(1, basic_total)*100,1)}%)",
                    f"{value_3} ({round(value_3/max(1, secondary_total)*100,1)}%)",
                    f"{value_4} ({round(value_4/max(1, community_total)*100,1)}%)",
                )
            )

    # Who the participant lives with &
    # Guardian working status
    for question_text, question_id in [
        ("Who the participant lives with (multiple selection)", "Q101"),
        ("Guardian working status", "Q2105"),
        ("In school", "Q201"),
        ("Religion", "Q2108"),
    ]:
        question = Question.objects.filter(
            question_id=question_id
        ).first()
        if question:
            options = question.options.all().order_by("value")
            for i, option in enumerate(options):
                responses = question.responses.filter(chosen_options=option)
                value_2, value_3, value_4 = [responses.filter(
                    adolescent__type=t,
                    created_at__gte=from_date,
                    created_at__lte=to_date,
                ).count() for t in [
                    "basic", "secondary", "community"]]
                value_1 = option.value
                name = question_text if i == 0 else ""
                rows.append(
                    Table1RowValue(
                        name,
                        str(value_1),
                        f"{value_2} ({round(value_2/max(1, basic_total)*100,1)}%)",
                        f"{value_3} ({round(value_3/max(1, secondary_total)*100,1)}%)",
                        f"{value_4} ({round(value_4/max(1, community_total)*100,1)}%)",
                    )
                )

    context = {
        "basic_total": basic_total,
        "secondary_total": secondary_total,
        "community_total": community_total,
        "rows": rows,
        "total": sum([basic_total, secondary_total, community_total])
    }

    # Writing PDF
    parent = settings.TEMP_REPORT_DIR
    parent.mkdir(parents=True, exist_ok=True)
    filename = parent / filename

    set_task_state(
        self,
        "WRITING",
        2,
        info=f"Writing the pdf report...")
    render_to_pdf_file(template_name, filename, context)
    # Preparing link
    set_task_state(self, "GENERATING", 3, info="Generating download link")
    set_task_state(self, "DONE", 3, info="Done")
