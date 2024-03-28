from django.urls import path
from . import views


app_name = "dashboard"
urlpatterns = [
    path("task_status/<str:task_id>", views.StreamTaskStatusView.as_view(), name="stream_task_status"),
]
