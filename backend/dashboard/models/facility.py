from django.db import models
from .mixin import UpstreamSyncBaseModel

class Facility(UpstreamSyncBaseModel):
    name = models.CharField(max_length=100, db_index=True)
    location = models.CharField(max_length=100)

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name_plural = "facilities"
