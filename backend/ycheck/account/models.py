from django.db import models
from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager, PermissionsMixin)
from django.contrib.auth.models import Group, Permission
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from django.utils.crypto import get_random_string
from django.utils import timezone



import geocoder



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
    changed_password = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)

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
        if self.first_name and self.last_name:
            return f"{self.first_name.title()} {self.last_name.title()}"
        return self.username





class Adolescent(models.Model):

    PRIMARY = 'PR'
    SECONDARY = 'SC'
    COMMUNITY = 'CM'

    ADOLESCENT_TYPE_CHOICES = [
        (PRIMARY, 'Primary'),
        (SECONDARY, 'Secondary'),
        (COMMUNITY, 'Community'),
    ]

    MALE = 'ML'
    FEMALE = 'FM'

    ADOLESCENT_SEX_TYPE = [
        (MALE, 'Male'),
        (FEMALE, 'Female'),
    ]

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    pid = models.CharField(unique=True, blank=True, max_length=10)
    picture = models.ImageField()
    dob = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=50)
    adolescent_type = models.CharField(max_length=2, choices=ADOLESCENT_TYPE_CHOICES)
    sex_type = models.CharField(max_length=2, choices=ADOLESCENT_SEX_TYPE)
    questionnaire_completed = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='adolescent_created')
    last_updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='adolescent_updated')




    def save(self, *args, **kwargs):
        if not self.pid:
            prefix = self.adolescent_type

            max_pid = Adolescent.objects.filter(pid__startswith=prefix).aggregate(max_pid=models.Max('pid'))['max_pid']
            if max_pid:
                next_pid_number = int(max_pid[2:]) + 1
            else:
                next_pid_number = 1

            self.pid = f'{prefix}{next_pid_number:05}'

        super().save(*args, **kwargs)


    def __str__(self):
        return f'{self.first_name} {self.first_name}'




class SecurityQuestion(models.Model):
    question = models.CharField(max_length=255)

    def __str__(self):
        return self.question


class SecurityQuestionAnswer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    security_question = models.ForeignKey(SecurityQuestion, on_delete=models.CASCADE)
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



