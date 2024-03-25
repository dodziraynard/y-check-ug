"""
URL configuration for ycheck project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

from dashboard.models.questions import Question


def health(request):
    use_db = request.GET.get("use_db", False)
    if use_db:
        questions = Question.objects.all()
        response = {"success": True, "all_questions": questions.count()}
    else:
        response = {"success": True}
    return JsonResponse(response)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('account/', include('accounts.urls')),
    path('pdf-reports/', include('pdf_processor.urls')),
    path('api/', include('rest_api.urls')),
    path('health/', health),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Customize django admin page.
# default: "Django Administration"
admin.site.site_header = "Y-CHECK UG SYSTEM ADMINISTRATION"
admin.site.index_title = "Site Administration"  # default: "Site Administration"
admin.site.site_title = 'Y-CHECK System Site Admin'  # default: "Django site admin"
