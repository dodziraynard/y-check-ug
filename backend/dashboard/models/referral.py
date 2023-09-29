from django.db import models
from .adolescent import Adolescent
from .facility import Facility
from accounts.models import User


class Service(models.Model):
    name = models.CharField(max_length=200, db_index=True)
    related_summary_flags = models.ManyToManyField("dashboard.SummaryFlag",blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name


class Referral(models.Model):
    adolescent = models.ForeignKey(Adolescent, on_delete=models.CASCADE)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)
    referral_reason = models.TextField()
    service_type = models.CharField(max_length=200)
    services = models.ManyToManyField(Service)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)


class Treatment(models.Model):
    referral = models.ForeignKey(Referral, on_delete=models.CASCADE)
    adolescent = models.ForeignKey(Adolescent, on_delete=models.CASCADE)
    total_service_cost = models.DecimalField(max_digits=10, decimal_places=2)
    date_of_service = models.DateField()
    picture_confirmed = models.BooleanField()
    full_treatment_received = models.BooleanField()
    provided_treaments = models.TextField()
    is_referred = models.TextField()
    no_referral_reason = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    reamrks = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)


