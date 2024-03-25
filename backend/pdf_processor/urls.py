from django.urls import path
from . import views


app_label = "pdf_processor"
urlpatterns = [
    path("table-5", views.Table5ReportView.as_view(), name="table_5"),
]
