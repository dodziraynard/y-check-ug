from django.db import models
from .mixin import UpstreamSyncBaseModel


class CheckupLocation(UpstreamSyncBaseModel):
    TYPE_CHOICES = [
        ('basic', 'basic'),
        ('secondary', 'secondary'),
        ('community', 'community'),
    ]
    name = models.CharField(max_length=200, unique=True)
    type = models.CharField(max_length=100, choices=TYPE_CHOICES)

    def __str__(self) -> str:
        return self.name
