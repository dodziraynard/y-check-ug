import logging
from io import BytesIO
from datetime import datetime
import uuid_extensions
from django.conf import settings
import hashlib
from django.db import models
import requests
from PIL import Image as PillowImage
from django.core import files
from django.core.files.base import ContentFile
from django.contrib.auth.base_user import BaseUserManager
from django.db import IntegrityError

from setup.models import NodeConfig


logger = logging.getLogger(__name__)


class UpstreamSyncManager(BaseUserManager):
    def get_queryset(self) -> models.QuerySet:
        return super().get_queryset()


class UpstreamSyncMethodsModel():

    def _get_serialised_value(self, field):
        if type(field) == models.fields.related.ManyToManyField:
            return list(getattr(self, field.name).all().values_list("id", flat=True))
        if type(field) in [models.fields.DateTimeField, models.fields.DateField]:
            date = getattr(self, field.name)
            if date:
                return date.isoformat()
            return None
        if type(field) == models.fields.BooleanField:
            return getattr(self, field.name)
        if type(field) in [models.fields.UUIDField, models.fields.DecimalField]:
            return str(getattr(self, field.name))
        if type(field) in [models.fields.files.ImageField, models.fields.files.FileField]:
            file = getattr(self, field.name)
            if file:
                return file.url
            return None
        if type(field) in [models.fields.related.ForeignKey, models.fields.related.OneToOneField]:
            obj = getattr(self, field.name)
            if obj:
                return obj.id
            return ""
        return getattr(self, field.name)

    @classmethod
    def _get_deserialised_value(cls, field, value):
        if type(field) in [models.fields.DateTimeField, models.fields.DateField]:
            if isinstance(value, str):
                return datetime.fromisoformat(value).astimezone()
            return None
        return value if value not in ["", "None"] else None

    def get_file_fields(self):
        fields = self.get_fields()
        result = []
        for field in fields:
            if type(field) in [models.fields.files.ImageField, models.fields.files.FileField]:
                result.append(field.name)
        return result

    def get_fields(self):
        return self._meta.fields + self._meta.many_to_many

    def serialise(self):
        logger.debug("Serialising %s", str(self))

        fields = self.get_fields()
        my_model_fields = {}
        for field in fields:
            value = self._get_serialised_value(field)
            my_model_fields[field.name] = value
        return my_model_fields

    def _download_image(self, field_name, source_url):
        logger.debug("Image %s", str(field_name))

        response = requests.get(source_url)
        filename = source_url.split("/")[-1].split(".")[0] + ".jpg"
        if response.status_code == 200:
            image = PillowImage.open(BytesIO(response.content))
            image = image.convert('RGB')
            image_io = BytesIO()
            image.save(image_io, "jpeg", quality=100)
            file = files.File(image_io, filename)
            getattr(self, field_name).save(filename, file)
            logger.debug("Saved %s", getattr(self, field_name).url)
        else:
            logger.error("Error while downloading image: %s",
                         response.status_code)

    def _download_file(self, field_name, source_url):
        logger.debug("File %s", str(field_name))

        response = requests.get(source_url)
        filename = source_url.split("/")[-1]
        if response.status_code == 200:
            file = files.File(ContentFile(response.content), filename)
            getattr(self, field_name).save(filename, file)
            logger.debug("Saved %s", getattr(self, field_name).url)
        else:
            logger.error("error while downloading image: %s",
                         response.status_code)

    @classmethod
    def deserialise_into_object(cls, model, data: dict, download_files=True):
        if not isinstance(data, dict):
            logger.debug(
                "Valid data type. Expected dict but got %s", type(data))
            return None

        # Check if this data already exists and skip.
        content_hash = data.get("content_hash", "random-string")
        if content_hash and content_hash != "None" and hasattr(model, "content_hash") and model.objects.filter(content_hash=content_hash).exists():
            return None

        parameters = {}
        unique_parameters = {}
        many_to_many_params = {}
        obj = None
        for key, value in data.items():
            if not (hasattr(model, key) and hasattr(getattr(model, key), "field")):
                continue
            field = getattr(model, key).field
            if type(field) == models.fields.related.ManyToManyField:
                many_to_many_params[key] = cls._get_deserialised_value(
                    field, value)
                continue
            if type(field) in [models.fields.files.ImageField, models.fields.files.FileField]:
                continue
            if type(field) in [models.fields.related.ForeignKey, models.fields.related.OneToOneField]:
                key += "_id"
            if field.name in ["id"]:
                unique_parameters[key] = cls._get_deserialised_value(
                    field, value)
            parameters[key] = cls._get_deserialised_value(field, value)

        exists = model.objects.filter(**unique_parameters).exists()

        if exists:
            all(map(parameters.pop, unique_parameters))
            parameters.pop("password", None)
            model.objects.filter(**unique_parameters).update(**parameters)
        else:
            try:
                obj = model.objects.create(**parameters)
            except IntegrityError as e:
                # Delete duplicate
                params = {}
                for field_name in model._meta.constraints[0].fields:
                    field = getattr(model, field_name).field
                    key = field.name
                    if type(field) in [models.fields.related.ForeignKey, models.fields.related.OneToOneField]:
                        key += "_id"
                    params[key] = cls._get_deserialised_value(
                        field, data[field_name])

                logger.debug("IntegrityError: %s. Removing %s", str(e), params)
                if params:
                    model.objects.filter(**params).delete()

                # Try creating new record again.
                obj = model.objects.create(**parameters)

        obj = model.objects.filter(**unique_parameters).first()

        # Set many to many relations.
        for key, value in many_to_many_params.items():
            getattr(obj, key).set(value)
            obj.save()

        # Download files
        if download_files:
            config, _ = NodeConfig.objects.get_or_create()
            if config.is_local and config.up_stream_host:
                # Only local nodes should donwload using the upstream host.
                # Host cannot download from local node.
                host = config.up_stream_host
                for field in obj.get_fields():
                    if type(field) == models.fields.files.ImageField and data.get(field.name):
                        source_url = host + data.get(field.name)
                        source_url = source_url.replace("//assets", "/assets")
                        obj._download_image(field.name, source_url)

                    if type(field) == models.fields.files.FileField and data.get(field.name):
                        source_url = host + data.get(field.name)
                        source_url = source_url.replace("//assets", "/assets")
                        obj._download_file(field.name, source_url)

        # Save to compute content hash.
        obj.save()
        return obj


class UpstreamSyncBaseModel(UpstreamSyncMethodsModel, models.Model):
    id = models.CharField(primary_key=True, max_length=120,
                          unique=True, default=uuid_extensions.uuid7, db_index=True)
    uuid = models.UUIDField(default=uuid_extensions.uuid7, null=True)
    localnode = models.CharField(max_length=100, null=True, blank=True)
    synced = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    content_hash = models.CharField(max_length=128, null=True, blank=True)

    objects = UpstreamSyncManager()

    class Meta:
        abstract = True

    def get_hash(self):
        values = []
        fields = sorted(list(self._meta.fields), key=lambda a: a.name)
        fields = list(filter(lambda a: a.name not in [
                      "created_at", "updated_at", "localnode", "synced", "content_hash"], fields))
        for field in fields:
            values.extend([field.name, str(getattr(self, field.name))])
        return hashlib.sha256(".".join(values).replace("None", "").encode()).hexdigest()

    def save(self, *args, **kwargs) -> None:
        self.synced = False
        self.localnode = settings.NODE_NAME
        self.content_hash = self.get_hash()
        return super().save(*args, **kwargs)
