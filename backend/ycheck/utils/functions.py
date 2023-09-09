import datetime
import logging

from django.apps import apps
from django.conf import settings
from django.contrib.auth.models import Permission
from django.db.models import Count, Q
from django.utils.html import strip_tags


logger = logging.getLogger("app")


def get_errors_from_form(form):
    errors = []
    for field, er in form.errors.items():
        title = field.title().replace("_", " ")
        errors.append(f"{title}: {strip_tags(er)}<br>")
    return "".join(errors)


def make_model_key_value(obj):
    data = {}
    for field in obj._meta.fields:
        if field.name in obj.__dict__:
            value = obj.__dict__[field.name]
            if isinstance(value, datetime.datetime) or isinstance(
                    value, datetime.date):
                value = value.strftime("%Y-%m-%d")
            data[field.name] = value
    return data


def get_all_user_permissions(user):
    permissions = []
    for perm in user.get_all_permissions():
        permissions.append(perm.split(".")[-1])
    return sorted(permissions)


def available_application_permissions():
    all_permissions = [
        perm['codename']
        for perm in Permission.objects.all().values('codename')
    ]
    all_permissions.sort()
    return all_permissions
