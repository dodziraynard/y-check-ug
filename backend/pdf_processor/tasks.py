"""
This module is responsible for processing files using the celery worker
"""
from datetime import datetime
from typing import List
from pdf_processor.utils import render_to_pdf_file
from django.conf import settings
from celery import shared_task
from collections import namedtuple
import logging
from django.utils import timezone
from ycheck.utils.constants import Colors
from dashboard.models import Adolescent, FlagLabel, SummaryFlag, CheckupLocation, Question
from django.utils.timezone import make_aware


logger = logging.getLogger(__name__)

Table5RowTotal = namedtuple(
    "Table5RowTotal", "male_14, female_14, male_19, female_19")
Table5RowValue = namedtuple(
    "Table5RowValue", "condition, male_14, female_14, male_19, female_19")
Table1RowValue = namedtuple(
    "Table1RowValue", "name, value_1, value_2, value_3, value_4")


def set_task_state(task,
                   message,
                   current,
                   total=3,
                   info="Processing",
                   link=None):
    try:
        task.update_state(state=message,
                          meta={
                              "current": str(current),
                              "total": total,
                              "info": info,
                              "link": link
                          })
    except Exception as e:
        logger.error(str(e))
        return


@shared_task(bind=True)
def generate_table_5_report(self, filename="report.pdf", from_date=None, to_date=None):
    template_name = "pdf_processor/table_5.html"

    # Validate from and to dates.
    if not isinstance(from_date, datetime):
        from_date = make_aware(datetime(2023, 1, 1))
    if not isinstance(to_date, datetime):
        to_date = timezone.now()

    set_task_state(self,
                   "RETRIEVING RECORDS",
                   1,
                   info=f"Retrieving invoice data.")
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
