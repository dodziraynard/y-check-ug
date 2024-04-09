from django.db import models
from .mixin import UpstreamSyncBaseModel


class DeletionBackLog(UpstreamSyncBaseModel):
    model_name = models.CharField(max_length=100)
    object_id = models.CharField(max_length=120)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.model_name} - {self.object_id}"
