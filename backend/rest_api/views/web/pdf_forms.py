import logging
from rest_framework import generics, permissions
from rest_framework.response import Response
from django.conf import settings
from dashboard.models import *
from django.shortcuts import render
from ycheck.utils.constants import Colors

from pdf_processor.utils import render_to_pdf_file

logger = logging.getLogger(__name__)


class GenerateReferralForm(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, referral_id):
        referral = Referral.objects.filter(id=referral_id).first()
        if not referral:
            return Response({"error_message": "Referral not found."})

        filename = f"{referral.adolescent.get_name().lower().replace(' ', '_')}-referral_{referral.id}.pdf"
        template_name = "pdf_processor/yc_03_referral_form.html"

        parent = settings.TEMP_REPORT_DIR
        parent.mkdir(parents=True, exist_ok=True)
        filename_path = parent / filename

        context = {
            "logo_url": request.build_absolute_uri("/static/images/logo.png"),
            "referral": referral,
        }
        render_to_pdf_file(template_name, filename_path, context)

        download_link = settings.TEMP_REPORT_URL + filename
        response_data = {
            "download_link": request.build_absolute_uri(download_link)
        }
        return Response(response_data)


def home(request):
    return render(request,'pdf_processor/try.html')


class GenerateScreeningForm(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, adolescent_id):

        try:
            adolescent = Adolescent.objects.get(pid=adolescent_id)
        except Adolescent.DoesNotExist:
            return Response({"error_message": "Adolescent not found."})

        red_or_green_flag_codes = [Colors.RED.value, Colors.GREEN.value]
        red_flag_code = Colors.RED.value
        red_flags = SummaryFlag.objects.filter(adolescent=adolescent, final_color_code__in=red_or_green_flag_codes)
        no_red_flags = SummaryFlag.objects.filter(adolescent=adolescent, final_color_code=red_flag_code)
        user = request.user
        full_name = f"{user.surname} {user.other_names}"
        
        filename = f"{adolescent.get_name().lower()}.pdf"
        template_name = "pdf_processor/try.html"

        parent = settings.TEMP_REPORT_DIR
        parent.mkdir(parents=True, exist_ok=True)
        filename_path = parent / filename

        context = {
            "logo_url": request.build_absolute_uri("/static/images/logo.png"),
            "red_flags": red_flags,
            "adolescent":adolescent,
            "full_name":full_name,
            "no_red_flags_count": no_red_flags.count(),
        }
        render_to_pdf_file(template_name, filename_path, context)

        download_link = settings.TEMP_REPORT_URL + filename
        response_data = {
            "download_link": request.build_absolute_uri(download_link)
        }
        return Response(response_data)
    
    
