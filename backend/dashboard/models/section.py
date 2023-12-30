from django.db import models
from .mixin import UpstreamSyncBaseModel

QUESTION_TYPE = [
    ('survey', 'survey'),
    ('assessment', 'assessment'),
    ('survey_feedback', 'survey_feedback'),
    ('practice', 'practice'),
]


class Section(UpstreamSyncBaseModel):
    name = models.CharField(max_length=100, db_index=True)
    instruction = models.TextField()
    question_type = models.CharField(
        max_length=100, default="survey",
        choices=QUESTION_TYPE, db_index=True)
    number = models.IntegerField(unique=True)
    requires_game = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.name
