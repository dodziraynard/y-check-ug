import logging
from rest_framework import permissions
from dashboard.models import Facility
from rest_api.views.mixins import SimpleCrudMixin
from rest_api.permissions import APILevelPermissionCheck
from rest_framework import generics, permissions, status

from dashboard.models import Adolescent, FlagLabel, SummaryFlag
from rest_framework.response import Response

from rest_api.serializers import (AdolescentSerializer,
                                  FacilitySerializer,
                                  SummaryFlagSerializer)

logger = logging.getLogger("app")


class AdolescentsAPI(SimpleCrudMixin):
    """
    Permform CRUD on adolescent.
    """
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = ["setup.view_adolescent"]

    serializer_class = AdolescentSerializer
    model_class = Adolescent
    response_data_label = "adolescent"
    response_data_label_plural = "adolescents"


class GetAdolescentProfile(generics.GenericAPIView):
    """
    Get the profile info of an adolescent.
    """
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    serializer_class = AdolescentSerializer

    def get(self, request, pid, *args, **kwargs):
        adolescent = Adolescent.objects.filter(pid=pid).first()
        if not adolescent:
            return Response({"error_message": f"{pid} not found."})

        response_data = {
            "adolescent": self.serializer_class(adolescent, context={"request": request}).data
        }
        return Response(response_data)


class GetSummaryFlags(generics.GenericAPIView):
    """
    Get the summary flags for an adolescent/patient.
    """
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    serializer_class = SummaryFlagSerializer

    def get(self, request, pid, *args, **kwargs):
        adolescent = Adolescent.objects.filter(pid=pid).first()
        if not adolescent:
            return Response({"error_message": f"{pid} not found."})

        # Compute flags
        flag_lables = FlagLabel.objects.all()
        for label in flag_lables:
            color = label.get_flag_color(adolescent)
            if not color:
                continue

            flag = SummaryFlag.objects.filter(
                adolescent=adolescent, name=label.name).first()
            if not flag:
                flag = SummaryFlag.objects.create(
                    adolescent=adolescent, name=label.name, computed_color_code=color)
            else:
                flag.computed_color_code = color
                flag.save()

        # Retrieve all flags
        flags = SummaryFlag.objects.filter(adolescent=adolescent)
        data = SummaryFlagSerializer(flags, many=True).data
        repsonse_data = {
            "summary_flags": data,
        }
        return Response(repsonse_data, status=status.HTTP_200_OK)

    def post(self, request, pid, *args, **kwargs):
        summary_flag_id = request.data.get("summary_flag_id")
        comment = request.data.get("comment")
        new_color = request.data.get("new_color")
        adolescent = Adolescent.objects.filter(pid=pid).first()
        if not adolescent:
            return Response({"error_message": f"{pid} not found."})
        flag = SummaryFlag.objects.filter(id=summary_flag_id).first()
        flag.comment = comment
        flag.updated_color_code = new_color
        flag.updated_by = request.user
        flag.save()

        return Response({"error": f"Updated successfully."})
    


class FacilitiesAPI(SimpleCrudMixin):
    """
    Permform CRUD on facility.
    """
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = ["setup.view_adolescent"]

    serializer_class = FacilitySerializer
    model_class = Facility
    response_data_label = "facility"
    response_data_label_plural = "facilities"
