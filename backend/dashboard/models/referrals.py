from functools import reduce
from django.db import models

from ycheck.utils.constants import ReferralStatus
from .adolescent import *
from .facility import Facility
from .mixin import UpstreamSyncBaseModel


class Service(UpstreamSyncBaseModel):
    name = models.CharField(max_length=200, db_index=True)
    related_flag_labels = models.ManyToManyField(
        "dashboard.FlagLabel", blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name


class Referral(UpstreamSyncBaseModel):
    referral_status_choices = [
        (ReferralStatus.NEW.value, ReferralStatus.NEW.value),
        (ReferralStatus.REVIEW.value, ReferralStatus.REVIEW.value),
        (ReferralStatus.COMPLETED.value, ReferralStatus.COMPLETED.value),
    ]
    adolescent = models.ForeignKey(Adolescent, on_delete=models.CASCADE)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)
    referral_reason = models.TextField()
    service_type = models.CharField(max_length=200)
    services = models.ManyToManyField(Service)
    created_by = models.ForeignKey("accounts.User", on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=100, default=ReferralStatus.NEW.value, choices=referral_status_choices)

    def __str__(self) -> str:
        return self.status

    @staticmethod
    def generate_query(query):
        queries = [models.Q(**{f"{key}__icontains": query})
                   for key in ["adolescent__pid", "adolescent__surname", "adolescent__other_names"]]
        return reduce(lambda x, y: x | y, queries)


class Treatment(UpstreamSyncBaseModel):
    referral = models.OneToOneField(
        Referral, related_name="treatment", on_delete=models.CASCADE)
    adolescent = models.ForeignKey(Adolescent, on_delete=models.CASCADE)
    total_service_cost = models.DecimalField(max_digits=10, decimal_places=2)
    date_of_service = models.DateField(auto_now_add=True)
    picture_confirmed = models.BooleanField(default=True)
    full_treatment_received = models.BooleanField()
    provided_treaments = models.TextField(null=True, blank=True)
    is_referred = models.BooleanField()
    no_referral_reason = models.TextField(null=True, blank=True)
    further_referral_facility = models.ForeignKey(
        Facility, on_delete=models.SET_NULL, null=True, blank=True)
    created_by = models.ForeignKey("accounts.User", on_delete=models.CASCADE)
    remarks = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    @staticmethod
    def generate_query(query):
        queries = [models.Q(**{f"{key}__icontains": query})
                   for key in ["adolescent__pid", "adolescent__surname", "adolescent__other_names"]]
        return reduce(lambda x, y: x | y, queries)
