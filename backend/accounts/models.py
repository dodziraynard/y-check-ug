import logging
from functools import reduce
from django.db import models
from django.db.models import Q
from io import BytesIO
from django.core.files import File
from PIL import Image as PillowImage, ImageOps
from django.utils import timezone
from django.contrib.auth.models import (
    AbstractBaseUser,
    Permission,
    Group,
    PermissionsMixin)
from accounts.managers import UserManager
from dashboard.models.mixin import UpstreamSyncMethodsModel

import geocoder

from dashboard.models.mixin import UpstreamSyncBaseModel
from ycheck.utils.storage import OverwriteStorage

logger = logging.getLogger(__name__)


class User(AbstractBaseUser, UpstreamSyncBaseModel, PermissionsMixin):
    username = models.CharField(max_length=30, unique=True, db_index=True)
    surname = models.CharField(max_length=50, null=True, blank=True, db_index=True)
    other_names = models.CharField(max_length=50, null=True, blank=True, db_index=True)
    phone = models.CharField(max_length=20, null=True, blank=True, db_index=True)
    photo = models.ImageField(upload_to='users', storage=OverwriteStorage(), blank=True, null=True)
    facility = models.ForeignKey("dashboard.Facility", related_name="users", on_delete=models.SET_NULL, blank=True, null=True)
    gender = models.CharField(max_length=50, null=True, blank=True, db_index=True)
    activated = models.BooleanField(default=False)
    last_login = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(default=timezone.now)
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

    def _compress_photo(self, height=500, width=500):
        if not self.photo:
            return

        logger.info("Compressing photo")

        user_name = f"{self.surname.lower()}_{self.other_names.lower()}"

        thumbnail = PillowImage.open(self.photo)
        thumbnail = ImageOps.exif_transpose(thumbnail)

        thumbnail.thumbnail((height, width), PillowImage.LANCZOS)
        thumb_io = BytesIO()
        thumbnail = thumbnail.convert('RGB')
        thumbnail.save(thumb_io, "jpeg", quality=80)
        self.photo = File(
            thumb_io, name=user_name.split(".")[0] + ".jpg")

    def save(self, *args, **kwargs) -> None:
        self._compress_photo()
        self.username = str(self.username).lower()
        self.surname = str(self.surname).upper()
        self.other_names = str(self.other_names).upper()
        return super().save(*args, **kwargs)


class ActivityLog(models.Model):
    username = models.CharField(max_length=100)
    action = models.TextField()
    ip = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self) -> str:
        return "%s %s" % (self.username, self.action)

    def get_latlng(self):
        return geocoder.ip(self.registration_ip).latlng


class SyncGroup(UpstreamSyncMethodsModel, Group):
    class Meta:
        proxy = True


class SyncPermission(UpstreamSyncMethodsModel, Permission):
    class Meta:
        proxy = True
