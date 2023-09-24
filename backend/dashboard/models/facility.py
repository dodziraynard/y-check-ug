from django.db import models


class Facility(models.Model):
    name = models.CharField(max_length=100, db_index=True)
    location = models.CharField(max_length=100)

    def __str__(self) -> str:
        return self.name
