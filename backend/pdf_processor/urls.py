from django.urls import path
from . import views


app_name = "pdf_processor"
urlpatterns = [
    path("preview/<str:template_name>", views.PreviewPDFView.as_view(), name="preview_pdf"),
]
