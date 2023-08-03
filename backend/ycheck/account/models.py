from django.db import models
from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager, PermissionsMixin)
import geocoder
from django.contrib.auth.models import Group, Permission



class UserManager(BaseUserManager):
    def _create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('The given ID must be set')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(username, password, **extra_fields)

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(username, password, **extra_fields)




class User(AbstractBaseUser, PermissionsMixin):

    username = models.CharField(max_length=30, unique=True)
    first_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    image = models.ImageField(upload_to='users', blank=True)

    activated = models.BooleanField(default=False)
    last_login = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    changed_password = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)


    is_superuser = models.BooleanField(default=False)
    groups = models.ManyToManyField(
        Group,
        blank=True,
        related_name="account_user_related",
        related_query_name="account_users",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        blank=True,
        related_name="account_user_related",
        related_query_name="account_users",
    )



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
        return "/static/images/default_profile.jpg"

    def get_name(self):
        if self.first_name and self.last_names:
            return f"{self.last_name.title()} {self.first_names.title()}"
        return self.username

    def save(self, *args, **kwargs):
        return super().save(*args, **kwargs)







