import logging
import math
from typing import List
from rest_framework import permissions
from ycheck.utils.functions import apply_filters
from dashboard.forms import FacilityForm
from rest_api.views.mixins import QUERY_PAGE_SIZE, SimpleCrudMixin
from rest_api.permissions import APILevelPermissionCheck
from rest_framework import generics, permissions, status
from ycheck.utils.constants import Colors, ReferralStatus
from django.db.models import Q
from dashboard.models import Adolescent, SummaryFlag, Referral, Facility, Service
from rest_framework.response import Response
from django.db.utils import IntegrityError
from rest_api.serializers import *

logger = logging.getLogger(__name__)


class AdolescentsAPI(SimpleCrudMixin):
    """
    Permform CRUD on adolescent.
    """
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = ["setup.access_all_patients"]

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
        SummaryFlag.compute_flag_color(adolescent=adolescent)

        # Retrieve all flags
        flags = SummaryFlag.objects.filter(
            adolescent=adolescent).order_by("label__name")
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
        service_ids = already_referred_services.exclude(services=None).values_list(
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
    required_permissions = ["setup.access_all_patients"]

    serializer_class = FacilitySerializer
    model_class = Facility
    form_class = FacilityForm
    response_data_label = "facility"
    response_data_label_plural = "facilities"


class TreatmentsAPI(SimpleCrudMixin):
    """
    Permform CRUD on treatment object.
    """
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = ["setup.access_treatments"]

    serializer_class = TreatmentSerializer
    model_class = Treatment
    response_data_label = "treatment"
    response_data_label_plural = "treatments"

    def modify_response_data(self, treatments: List[Treatment], request=None):
        if not (request and request.user.has_perm("setup.access_all_treatments")):
            treatments = treatments.filter(created_by=request.user)
        return treatments


class AdolescentReferrals(generics.GenericAPIView):
    """
    Get the summary flags for an adolescent/patient.
    """
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    serializer_class = ReferralSerializer

    def get(self, request, pid, *args, **kwargs):
        adolescent = Adolescent.objects.filter(pid=pid).first()
        if not adolescent:
            return Response({"error_message": f"{pid} not found."})

        referrals = Referral.objects.filter(adolescent=adolescent)
        if not request.user.has_perm("setup.access_all_referrals"):
            referrals = referrals.filter(facility=request.user.facility)

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
        try:
            if referral:
                referral.update(**data)
                referral = referral.first()
            else:
                referral = Referral.objects.create(created_by=request.user,
                                                   adolescent=adolescent,
                                                   ** data)
        except IntegrityError as e:
            return Response({"error_message": f"{str(e)}"})

        referral.services.set(services)
        repsonse_data = {
            "referral": self.serializer_class(referral).data,
        }
        return Response(repsonse_data, status=status.HTTP_200_OK)

    def delete(self, request, pid, *args, **kwargs):
        deleted = Referral.objects.filter(id=request.data.get("id")).delete()
        response_data = {
            "referral_id": request.data.get("id")
        }
        return Response(response_data)


class MyReferrals(generics.GenericAPIView):
    """
    Get the list of referrals for user's facility.
    """
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    serializer_class = ReferralSerializer

    def get(self, request, *args, **kwargs):
        referrals = Referral.objects.all().order_by("-created_at")
        query = request.GET.get("query") or request.GET.get("q")
        filters = request.GET.getlist("filters")
        if not request.user.has_perm("setup.access_all_referrals"):
            referrals = referrals.filter(facility=request.user.facility)

        if query and hasattr(Referral, "generate_query"):  # type: ignore
            referrals = referrals.filter(
                Referral.generate_query(query))  # type: ignore

        if filters:
            referrals = apply_filters(referrals, filters)

        # Pagination
        page = request.GET.get("page", "")
        page_size = request.GET.get("page_size", "")
        page_size = int(
            page_size) if page_size.isnumeric() else QUERY_PAGE_SIZE
        total_pages = max(1, math.ceil(referrals.count() / page_size))

        page = int(page) if page.isnumeric() else 1
        if page > total_pages:
            page = total_pages
        page = max(page, 1)

        paginated_referrals = referrals[(
            page - 1) * page_size:page * page_size]
        prev_page = page - 1 if page > 1 else None
        next_page = page + 1 if total_pages > page else None

        referrals_data = self.serializer_class(
            paginated_referrals, many=True, context={"request": request}).data
        repsonse_data = {
            "referrals": referrals_data,
            "page": page,
            "page_size": page_size,
            "total": referrals.count(),
            "next_page": next_page,
            "previous_page": prev_page,
            "total_pages": total_pages,

        }
        return Response(repsonse_data, status=status.HTTP_200_OK)


class ReferralDetail(generics.GenericAPIView):
    """
    Get the details of a referral
    """
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    serializer_class = ReferralSerializer

    def get(self, request, referral_id, *args, **kwargs):
        referrals = Referral.objects.all()
        if not request.user.has_perm("setup.access_all_referrals"):
            referrals = referrals.filter(facility=request.user.facility)

        referral = referrals.filter(id=referral_id).first()
        if not referral:
            return Response({"error_message": f"Referral not found."})
        if referral.status == ReferralStatus.NEW.value:
            referral.status = ReferralStatus.REVIEW.value
            referral.save()

        adolescent = AdolescentSerializer(
            referral.adolescent, context={"request": request}).data
        referral_data = self.serializer_class(referral).data

        # Retrieve all flags
        relevant_adolescent_responses = {}
        for service in referral.services.all():
            flag_labels = service.related_flag_labels.all()
            flags = SummaryFlag.objects.filter(label__in=flag_labels).distinct()
            responses = [
                response for flag in flags for response in flag.get_responses()]
            relevant_adolescent_responses[service.id] = responses

        repsonse_data = {
            "referral": referral_data,
            "adolescent": adolescent,
            "relevant_adolescent_responses": relevant_adolescent_responses,
        }
        return Response(repsonse_data, status=status.HTTP_200_OK)


class ReferralTreatment(generics.GenericAPIView):
    """
    Get the treatment feedback for a referral
    """
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    serializer_class = TreatmentSerializer

    def get(self, request, referral_id, *args, **kwargs):
        referrals = Referral.objects.all()
        if not request.user.has_perm("setup.access_all_referrals"):
            referrals = referrals.filter(facility=request.user.facility)

        referral = referrals.filter(id=referral_id).first()
        if not referral:
            return Response({"error_message": f"Referral not found."})

        treatment = Treatment.objects.filter(referral=referral).first()
        response_data = {
            "treatment": self.serializer_class(treatment).data
        }
        return Response(response_data)

    def post(self, request, referral_id, *args, **kwargs):
        referral = Referral.objects.filter(id=referral_id).first()
        if not referral:
            return Response({"error_message": f"Referral not found."})
        treatment = Treatment.objects.filter(referral=referral)

        # Posted data
        total_service_cost = request.data.get("total_service_cost")
        full_treatment_received = request.data.get("full_treatment_received")
        provided_treaments = request.data.get("provided_treaments")
        is_referred = request.data.get("is_referred")
        no_referral_reason = request.data.get("no_referral_reason")
        remarks = request.data.get("remarks")
        further_referral_facility = request.data.get(
            "further_referral_facility")

        treatment_data = {
            "referral": referral,
            "adolescent": referral.adolescent,
            "total_service_cost": total_service_cost,
            "full_treatment_received": full_treatment_received,
            "provided_treaments": provided_treaments,
            "is_referred": is_referred,
            "further_referral_facility_id": further_referral_facility,
            "no_referral_reason": no_referral_reason,
            "remarks": remarks,
        }
        if not treatment:
            treatment_data["created_by"] = request.user
            treatment = Treatment.objects.create(**treatment_data)
        else:
            treatment.update(**treatment_data)
            treatment = treatment.first()

        referral.status = ReferralStatus.COMPLETED.value
        referral.save()

        response_data = {
            "treatment": self.serializer_class(treatment).data
        }
        return Response(response_data)
