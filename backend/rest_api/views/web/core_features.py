import logging
from rest_framework import permissions
from dashboard.models.referrals import Referral
from dashboard.forms import FacilityForm
from dashboard.models import Facility, Service
from rest_api.views.mixins import SimpleCrudMixin
from rest_api.permissions import APILevelPermissionCheck
from rest_framework import generics, permissions, status
from ycheck.utils.constants import Colors, ReferralStatus
from django.db.models import Q
from dashboard.models import Adolescent, FlagLabel, SummaryFlag
from rest_framework.response import Response

from rest_api.serializers import *

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
                adolescent=adolescent, label=label).first()
            if not flag:
                flag = SummaryFlag.objects.create(
                    adolescent=adolescent, label=label, computed_color_code=color)
            elif flag.computed_color_code != color:
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


class GetRecommendedServices(generics.GenericAPIView):
    """
    Get the summary flags for an adolescent/patient.
    """
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    serializer_class = ServiceSerializer

    def get(self, request, pid, *args, **kwargs):
        adolescent = Adolescent.objects.filter(pid=pid).first()
        if not adolescent:
            return Response({"error_message": f"{pid} not found."})

        problematic_flags = SummaryFlag.objects.filter(adolescent=adolescent).exclude(
            (Q(computed_color_code=Colors.GREEN.value) & Q(updated_color_code=None))
            | Q(updated_color_code=Colors.GREEN.value)
        )
        label_ids = problematic_flags.values_list("label", flat=True)

        already_referred_services = Referral.objects.filter(
            adolescent=adolescent).exclude(status=ReferralStatus.COMPLETED.value)
        service_ids = already_referred_services.values_list(
            "services", flat=True)
        services = Service.objects.filter(
            related_flag_labels__id__in=label_ids).exclude(id__in=service_ids)

        services = self.serializer_class(services, many=True).data
        repsonse_data = {
            "services": services,
        }
        return Response(repsonse_data, status=status.HTTP_200_OK)


class FacilitiesAPI(SimpleCrudMixin):
    """
    Permform CRUD on facility.
    """
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = ["setup.view_adolescent"]

    serializer_class = FacilitySerializer
    model_class = Facility
    form_class = FacilityForm
    response_data_label = "facility"
    response_data_label_plural = "facilities"


class AdolescentReferrals(generics.GenericAPIView):
    """
    Get the summary flags for an adolescent/patient.
    """
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    serializer_class = ReferralSerialiser

    def get(self, request, pid, *args, **kwargs):
        adolescent = Adolescent.objects.filter(pid=pid).first()
        if not adolescent:
            return Response({"error_message": f"{pid} not found."})

        referrals = Referral.objects.filter(adolescent=adolescent)
        referrals = self.serializer_class(referrals, many=True).data
        repsonse_data = {
            "referrals": referrals,
        }
        return Response(repsonse_data, status=status.HTTP_200_OK)

    def post(self, request, pid, *args, **kwargs):
        adolescent = Adolescent.objects.filter(pid=pid).first()
        if not adolescent:
            return Response({"error_message": f"{pid} not found."})
    
        referral = Referral.objects.filter(id=request.data.get("id"))
        service_names = request.data.get("service_names")
        services = Service.objects.filter(name__in=service_names)

        data = {
            "service_type": request.data.get("service_type"),
            "facility_id": request.data.get("facility_id"),
            "referral_reason": request.data.get("referral_reason"),
        }
        if referral:
            referral.update(**data)
        else:
            referral = Referral.objects.create(created_by=request.user,
                                               adolescent=adolescent,
                                               ** data)
        referral.services.set(services)
        repsonse_data = {
            "referral": self.serializer_class(referral).data,
        }
        return Response(repsonse_data, status=status.HTTP_200_OK)
