from django.db import models

from .mixin import UpstreamSyncBaseModel


class Service(UpstreamSyncBaseModel):
    name = models.CharField(max_length=200, db_index=True)
    related_flag_labels = models.ManyToManyField(
        "dashboard.FlagLabel", blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name
