from functools import reduce
from django.db import models

from .adolescent import Adolescent
from .facility import Facility
from .mixin import UpstreamSyncBaseModel
from .referrals import Referral


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



class OnSpotTreatment(UpstreamSyncBaseModel):
    adolescent_id = models.ForeignKey(Adolescent, on_delete=models.CASCADE)
    created_by = models.ForeignKey("accounts.User", on_delete=models.CASCADE)
    provided_treaments = models.TextField(null=True, blank=True)
    total_service_cost = models.DecimalField(max_digits=10, decimal_places=2)
    remarks = models.TextField(null=True, blank=True)
    date_of_service = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return str(self.adolescent_id.surname)