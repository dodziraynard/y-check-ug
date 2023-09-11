from django.db import models


class CheckupLocation(models.Model):
    TYPE_CHOICES = [
        ('primary', 'primary'),
        ('secondary', 'secondary'),
        ('community', 'community'),
    ]
    uuid = models.UUIDField(null=True, blank=True)
    name = models.CharField(max_length=200, unique=True)
    type = models.CharField(max_length=100, choices=TYPE_CHOICES)

    def __str__(self) -> str:
        return self.name
