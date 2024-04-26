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
def generate_yc_03_referral_form(self,
                                 filename="report.pdf"):
    template_name = "pdf_processor/yc_03_referral_form.html"

    set_task_state(self,
                   "RETRIEVING RECORDS",
                   1,
                   info=f"Retrieving invoice data.")

    context = {

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
