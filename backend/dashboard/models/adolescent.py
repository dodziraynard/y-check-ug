from datetime import datetime
from django.db import models
from functools import reduce
from django.utils.timezone import make_aware
from .mixin import UpstreamSyncBaseModel

QUESTION_TYPE = [
    ('survey', 'survey'),
    ('assessment', 'assessment'),
    ('survey_feedback', 'survey_feedback'),
]


class Adolescent(UpstreamSyncBaseModel):
    ADOLESCENT_TYPE_CHOICES = [
        ("basic", 'basic'),
        ("secondary", 'secondary'),
        ("community", 'community'),
    ]
    ADOLESCENT_SEX_TYPE = [
        ("male", 'male'),
        ("female", 'female'),
    ]
    pid = models.CharField(unique=True, max_length=20, db_index=True)
    surname = models.CharField(max_length=50, db_index=True)
    other_names = models.CharField(max_length=50, db_index=True)
    visit_type = models.CharField(max_length=50, blank=True, null=True)
    consent = models.CharField(max_length=100, blank=True, null=True)
    picture = models.ImageField(upload_to='images/', blank=True, null=True)
    dob = models.DateTimeField(null=True, blank=True)
    check_up_location = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=ADOLESCENT_TYPE_CHOICES)
    residential_status = models.CharField(max_length=200, null=True, blank=True)
    school = models.CharField(max_length=200, null=True, blank=True)
    grade = models.CharField(max_length=200, null=True, blank=True)
    leaves_in_catchment = models.CharField(max_length=200, null=True, blank=True)
    gender = models.CharField(max_length=50, blank=True, null=True)
    questionnaire_completed = models.BooleanField(default=False)
    completed_question = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        "accounts.User", on_delete=models.SET_NULL, null=True, related_name='adolescent_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.surname} {self.other_names}'

    def get_age(self):
        return int((make_aware(datetime.today())-self.dob).days / 365.25)

    def get_name(self):
        return f"{self.surname} {self.other_names}"

    @staticmethod
    def generate_query(query):
        queries = [models.Q(**{f"{key}__icontains": query})
                   for key in ["pid", "surname", "other_names", "gender"]]
        return reduce(lambda x, y: x | y, queries)


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
