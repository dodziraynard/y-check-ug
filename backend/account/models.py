from django.db import models
from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager, PermissionsMixin)
import geocoder
from django.contrib.auth.models import Group, Permission



''' USER MANAGEMENT '''

class UserManager(BaseUserManager):

    def _create_user(self, username, password=None, **extra_fields):
        #Create and save a User with the given ID and password.
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


        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_staff=True.')

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


    # fields from PermissionsMixin
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



''' ADOLESCENT MODEL'''

# class Adolescent(models.Model):

#     PRIMARY = 'PR'
#     SECONDARY = 'SC'
#     COMMUNITY = 'CM'

#     ADOLESCENT_TYPE_CHOICES = [
#         (PRIMARY, 'Primary'),
#         (SECONDARY, 'Secondary'),
#         (COMMUNITY, 'Community'),
#     ]


#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     pid = models.CharField(unique=True, max_length=10)
#     dob = models.DateField(null=True, blank=True)
#     location = models.CharField(max_length=50)
#     adolescent_type = models.CharField(max_length=30, choices=ADOLESCENT_TYPE_CHOICES)



#     def __str__(self):
#         return self.username



''' ACTIVITY LOG MODEL'''

# class ActivityLog(models.Model):
#     username = models.CharField(max_length=100)
#     action = models.TextField()
#     ip = models.CharField(max_length=100, null=True, blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self) -> str:
#         return "%s %s" % (self.username, self.action)

#     def get_latlng(self):
#         return geocoder.ip(self.registration_ip).latlng





