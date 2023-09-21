import logging
from rest_framework import permissions
from rest_api.views.mixins import SimpleCrudMixin
from rest_api.permissions import APILevelPermissionCheck
from rest_framework import generics, permissions, status

from dashboard.models import Adolescent
from rest_framework.response import Response

from rest_api.serializers import (AdolescentSerializer,
                                  UserSerializer)

logger = logging.getLogger("app")


class AdolescentsAPI(SimpleCrudMixin):
    """
    Perm CRUD on adolescent.
    """
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = ["setup.view_adolescent"]

    serializer_class = AdolescentSerializer
    model_class = Adolescent
    response_data_label = "adolescent"
    response_data_label_plural = "adolescents"


class GetSummaryFlags(generics.GenericAPIView):
    """
    Get the summary flags for an adolescent/patient.
    """
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]

    def get(self, request, pid, *args, **kwargs):
        adolescent = Adolescent.objects.filter(pid=pid).first()
        if not adolescent:
            return Response({"error_message": f"{pid} not found."})

        dummary_flags = [
            {"name": "Home", "color": "#275c69"},
            {"name": "Eating", "color": "red"},
            {"name": "Education", "color": "orange"},
        ]
        return Response({"flags": dummary_flags})
