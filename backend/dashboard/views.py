from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.shortcuts import render
from django.views import View


class DashboardOverview(PermissionRequiredMixin, View):
    template_name = "dashboard/accounting/index.html"
    permission_required = [
        "setup.view_main_dashboard",
    ]

    @method_decorator(login_required(login_url="accounts:login"))
    def get(self, request):
        return render(request, self.template_name)
