"""
This module is responsible for processing files using the celery worker
"""
from datetime import datetime
from pdf_processor.utils import render_to_pdf_file
from django.conf import settings
from celery import shared_task
from collections import namedtuple
import logging
from django.utils import timezone
from ycheck.utils.constants import Colors
from dashboard.models import Adolescent, FlagLabel, SummaryFlag
from django.utils.timezone import make_aware


logger = logging.getLogger(__name__)

Table5RowTotal = namedtuple(
    "Table5RowTotal", "male_14, female_14, male_19, female_19")
Table5RowValue = namedtuple(
    "Table5RowValue", "condition, male_14, female_14, male_19, female_19")


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
