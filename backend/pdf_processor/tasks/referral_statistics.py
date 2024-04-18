"""
This module is responsible for processing files using the celery worker
"""
from collections import namedtuple
from datetime import datetime
from ycheck.utils.constants import ReferralStatus
from dashboard.models.referrals import Referral
from pdf_processor.utils import render_to_pdf_file
from django.conf import settings
from celery import shared_task
import logging
from django.utils import timezone
from django.utils.timezone import make_aware
from pdf_processor.utils import set_task_state


logger = logging.getLogger(__name__)

ReferralStatRow = namedtuple(
    "ReferralStatRow", "facility, new, in_review, completed, total")


@shared_task(bind=True)
def generate_referral_stats_report(self,
                                   filename="report.pdf",
                                   from_date=None,
                                   to_date=None):
    template_name = "pdf_processor/referral_stats_report.html"

    # Validate from and to dates.
    if not isinstance(from_date, datetime):
        from_date = make_aware(datetime(2023, 1, 1))
    if not isinstance(to_date, datetime):
        to_date = timezone.now()

    set_task_state(self,
                   "RETRIEVING RECORDS",
                   1,
                   info=f"Retrieving invoice data.")

    rows = []
    referrals = Referral.objects.filter(
        created_at__gte=from_date,
        created_at__lte=to_date,
    )
    facilities = set(referrals.values_list("facility__name", flat=True))
    for facility in facilities:
        f_referrals = referrals.filter(facility__name=facility)
        new = f_referrals.filter(status=ReferralStatus.NEW.value).count()
        in_review = f_referrals.filter(
            status=ReferralStatus.REVIEW.value).count()
        completed = f_referrals.filter(
            status=ReferralStatus.COMPLETED.value).count()
        rows.append(
            ReferralStatRow(facility, new, in_review, completed,
                            new + in_review + completed))

    context = {
        "from_date": from_date,
        "to_date": to_date,
        "rows": rows,
    }

    # Writing PDF
    parent = settings.TEMP_REPORT_DIR
    parent.mkdir(parents=True, exist_ok=True)
    filename = parent / filename

    set_task_state(self, "WRITING", 2, info=f"Writing the pdf report...")
    render_to_pdf_file(template_name, filename, context)
    # Preparing link
    set_task_state(self, "GENERATING", 3, info="Generating download link")
    set_task_state(self, "DONE", 3, info="Done")
