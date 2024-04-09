from functools import reduce
from django.db import models

from ycheck.utils.constants import ReferralStatus
from .adolescent import *
from .service import Service
from .facility import Facility
from .mixin import UpstreamSyncBaseModel


class Referral(UpstreamSyncBaseModel):
    referral_status_choices = [
        (ReferralStatus.NEW.value, ReferralStatus.NEW.value),
        (ReferralStatus.REVIEW.value, ReferralStatus.REVIEW.value),
        (ReferralStatus.COMPLETED.value, ReferralStatus.COMPLETED.value),
    ]
    adolescent = models.ForeignKey(Adolescent, on_delete=models.CASCADE)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)
    is_onsite = models.BooleanField(default=False)
    referral_reason = models.TextField()
    service_type = models.CharField(max_length=200)
    services = models.ManyToManyField(Service)
    created_by = models.ForeignKey("accounts.User", on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=100, default=ReferralStatus.NEW.value, choices=referral_status_choices)

    def __str__(self) -> str:
        return f"{self.adolescent.get_name()} - {self.status}"

    @staticmethod
    def generate_query(query):
        queries = [models.Q(**{f"{key}__icontains": query})
                   for key in ["adolescent__pid", "adolescent__surname", "adolescent__other_names"]]
        return reduce(lambda x, y: x | y, queries)
