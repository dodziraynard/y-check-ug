import datetime
import logging


from django.contrib.auth.models import Permission
from django.db.models import Count, Q
from django.utils.html import strip_tags
from setup.models import SetupPerm  


logger = logging.getLogger("app")


def apply_filters(objects, filters):
    if "archive" not in "".join(filters) and hasattr(objects.first(), "archived"):
        objects = objects.filter(archived=False)

    for filter in filters:
        filter = filter.split(":")
        if len(filter) == 2:
            key, value = filter
            if hasattr(objects.first(), key):
                if type(getattr(objects.first(), key)) == bool:
                    value = "1" in value or "t" in value
            if value == "null":
                objects = objects.filter(**{key: None})
            else:
                objects = objects.filter(**{key: value})

        # Special case for validation conflict
        elif len(filter) == 3:
            key, value, annotation = filter
            objects = objects.annotate(c=Count(annotation)).filter(
                c__gt=1).filter(second_audio_status=ValidationStatus.PENDING.value)
    return objects.distinct()


def get_errors_from_form(form):
    errors = []
    for field, er in form.errors.items():
        title = field.title().replace("_", " ")
        errors.append(f"{title}: {strip_tags(er)}<br>")
    return "".join(errors)


def make_model_key_value(obj):
    data = {}
    for field in obj._meta.get_fields():
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

def relevant_permission_objects():
    setup_perm_permissions = [
        permission[0]
        for permission in SetupPerm._meta.permissions
    ]

    permissions = Permission.objects.filter(
        codename__in=setup_perm_permissions
    ).order_by("name")

    return permissions