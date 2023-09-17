from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser, PermissionsMixin)
from django.contrib.auth.hashers import make_password
from django.utils.crypto import get_random_string
from django.utils import timezone
from accounts.managers import UserManager
from django.conf import settings


import geocoder


class User(AbstractBaseUser, PermissionsMixin):
    uuid = models.UUIDField(null=True, blank=True)
    username = models.CharField(max_length=30, unique=True)
    surname = models.CharField(max_length=50, null=True, blank=True)
    other_names = models.CharField(max_length=50, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    photo = models.ImageField(upload_to='users', blank=True, null=True)

    activated = models.BooleanField(default=False)
    last_login = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    changed_password = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)

    security_answer_1 = models.CharField(max_length=100, null=True, blank=True)
    security_answer_2 = models.CharField(max_length=100, null=True, blank=True)

    created_by = models.ForeignKey(
        "User", related_name="created_users", on_delete=models.SET_NULL, null=True, blank=True)
    updated_by = models.ForeignKey(
        "User", related_name="updated_users", on_delete=models.SET_NULL, null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'username'

    class Meta:
        permissions = [
            ('reset_password', 'Can reset user password'),
        ]

    def model_name(self):
        return self.__class__.__name__.lower()

    def get_photo_url(self):
        if self.image:
            return self.image.url
        return "/static/images/user-default.svg"

    def get_name(self):
        if self.surname and self.other_names:
            return f"{self.surname.title()} {self.other_names.title()}"
        return self.username


class Adolescent(models.Model):
    ADOLESCENT_TYPE_CHOICES = [
        ("primary", 'primary'),
        ("secondary", 'secondary'),
        ("community", 'community'),
    ]
    ADOLESCENT_SEX_TYPE = [
        ("male", 'male'),
        ("female", 'female'),
    ]
    uuid = models.UUIDField(null=True, blank=True)
    pid = models.CharField(unique=True, blank=True, null=True, max_length=10)
    surname = models.CharField(max_length=50)
    other_names = models.CharField(max_length=50)
    visit_type = models.CharField(max_length=50, blank=True, null=True)
    consent = models.CharField(max_length=50, blank=True, null=True)
    picture = models.ImageField(upload_to='images/', blank=True, null=True)
    dob = models.DateTimeField(null=True, blank=True)
    check_up_location = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=ADOLESCENT_TYPE_CHOICES)
    gender = models.CharField(max_length=50, blank=True, null=True)
    questionnaire_completed = models.BooleanField(default=False)
    completed_question = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='adolescent_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.pid:
            prefix = settings.SITE_CODE
            self.pid = f'{prefix}{str(self.id).zfill(3)}'

        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.surname} {self.other_names}'


class SecurityQuestion(models.Model):
    question = models.CharField(max_length=255)

    def __str__(self):
        return self.question


class SecurityQuestionAnswer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    security_question = models.ForeignKey(
        SecurityQuestion, on_delete=models.CASCADE)
    answer = models.CharField(max_length=64)

    class Meta:
        unique_together = ['user', 'security_question']

    def save(self, *args, **kwargs):
        self.answer = make_password(self.answer)
        super().save(*args, **kwargs)


class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = get_random_string(64)
        super().save(*args, **kwargs)

    def is_valid(self):
        expiration_date = self.created_at + timezone.timedelta(hours=24)
        return timezone.now() < expiration_date


class ActivityLog(models.Model):
    username = models.CharField(max_length=100)
    action = models.TextField()
    ip = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return "%s %s" % (self.username, self.action)

    def get_latlng(self):
        return geocoder.ip(self.registration_ip).latlng


# BASIC SCHOOL MODEL
class BasicSchool(models.Model):
    school_name = models.CharField(max_length=100)

    def __str__(self):
        return self.school_name

# SENIOR HIGH MODEL


class SNRSchool(models.Model):
    school_name = models.CharField(max_length=100)

    def __str__(self):
        return self.school_name

# COMMUNITY MODEL


class Community(models.Model):
    community_name = models.CharField(max_length=100)

    def __str__(self):
        return self.community_name


QUESTION_CATEGORY = [
    ('Home', 'Home'),
    ('Education and employment', 'Education and employment'),
    ('Eating', 'Eating'),
    ('Activities and Peers', 'Activities and Peers'),
    ('Drugs and alcohol', 'Drugs and alcohol'),
    ('Sexuality', 'Sexuality'),
    ('Emotions', 'Emotions'),
    ('Safety/Security', 'Safety/Security'),
    ('Oral Hygiene', 'Oral Hygiene'),
    ('Physical health 1', 'Physical health 1'),
    ('Physical health 2', 'Physical health 2'),
]


class Question(models.Model):
    cation = models.CharField(max_length=200, blank=True, null=True)
    title = models.CharField(max_length=200)
    type = models.CharField(max_length=100)
    category = models.CharField(max_length=200, choices=QUESTION_CATEGORY)
    subtitle = models.CharField(max_length=100, blank=True, null=True)
    picture = models.ImageField(
        upload_to='question_pictures/', blank=True, null=True)

    def __str__(self):
        return self.title


class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    option_id = models.CharField(max_length=255)
    option = models.CharField(max_length=255)

    def __str__(self):
        return self.question.title


class UserResponse(models.Model):
    adolescent = models.ForeignKey(Adolescent, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    option_responses = models.ManyToManyField(Option, blank=True, null=True)
    text_response = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Adolescent: {self.adolescent}, Question Title: {self.question}"
