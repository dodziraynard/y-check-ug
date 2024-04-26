import logging
from django.views import View
from django.shortcuts import HttpResponse
from django.views import View

from .utils import render_to_pdf

logger = logging.getLogger(__name__)


class PreviewPDFView(View):

    def get(self, request, template_name):
        self.template_name = f"pdf_processor/{template_name}.html"

        print("yc_03_referral_form", self.template_name)
        context = {}

        pdf = render_to_pdf(self.template_name, context)
        if pdf:
            response = HttpResponse(pdf, content_type='application/pdf')
            filename = f"{template_name}.pdf"
            content = f"inline; filename={filename}"
            download = request.GET.get("download")
            if download:
                content = "attachment; filename=%s" % (filename)
            response['Content-Disposition'] = content
            return response
        return HttpResponse("Not found", status=404)
