from functools import reduce
from django.db import models
from django.db.models import Q
import uuid
from django.contrib.auth.models import (
    AbstractBaseUser, PermissionsMixin)
from accounts.managers import UserManager


import geocoder

from dashboard.models.mixin import UpstreamSyncBaseModel
from ycheck.utils.storage import OverwriteStorage


class User(AbstractBaseUser, UpstreamSyncBaseModel, PermissionsMixin):
    username = models.CharField(max_length=30, unique=True, db_index=True)
    surname = models.CharField(
        max_length=50, null=True, blank=True, db_index=True)
    other_names = models.CharField(
        max_length=50, null=True, blank=True, db_index=True)
    phone = models.CharField(max_length=20, null=True,
                             blank=True, db_index=True)
    photo = models.ImageField(
        upload_to='users', storage=OverwriteStorage(), blank=True, null=True)
    facility = models.ForeignKey(
        "dashboard.Facility", on_delete=models.SET_NULL, blank=True, null=True)
    gender = models.CharField(max_length=50, null=True,
                              blank=True, db_index=True)
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

    @staticmethod
    def generate_query(query):
        queries = [Q(**{f"{key}__icontains": query})
                   for key in ["phone", "surname", "username", "other_names"]]
        return reduce(lambda x, y: x | y, queries)

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

    @property
    def fullname(self):
        return f"{self.surname} {self.other_names}"


class ActivityLog(models.Model):
    username = models.CharField(max_length=100)
    action = models.TextField()
    ip = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return "%s %s" % (self.username, self.action)

    def get_latlng(self):
        return geocoder.ip(self.registration_ip).latlng
