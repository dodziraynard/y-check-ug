from django.db import models
from .mixin import UpstreamSyncBaseModel
import logging

logger = logging.getLogger(__name__)


class ComputedAverageActivityTime(UpstreamSyncBaseModel):
    activity = models.CharField(max_length=100, db_index=True)
    key = models.CharField(max_length=100, unique=True, db_index=True)
    status = models.CharField(max_length=50, default="completed")
    average_time_in_seconds = models.IntegerField(default=0)
    order = models.IntegerField(default=0)
    required = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.activity
