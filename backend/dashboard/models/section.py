from django.db import models
from .mixin import UpstreamSyncBaseModel
from .constant import QUESTION_TYPE, STUDY_PHASE_CHOICES


class Section(UpstreamSyncBaseModel):
    name = models.CharField(max_length=100, db_index=True)
    instruction = models.TextField()
    question_type = models.CharField(max_length=100,
                                     default="survey",
                                     choices=QUESTION_TYPE,
                                     db_index=True)
    number = models.IntegerField(unique=True)
    requires_game = models.BooleanField(default=False)
    exclude_study_phase = models.CharField(max_length=50,
                                           choices=STUDY_PHASE_CHOICES,
                                           blank=True,
                                           null=True)

    def __str__(self) -> str:
        return self.name
