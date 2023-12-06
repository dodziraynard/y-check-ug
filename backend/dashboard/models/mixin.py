import uuid
from io import BytesIO
from datetime import datetime
from django.db import models
import requests
from PIL import Image as PillowImage
from django.core import files
from django.core.files.base import ContentFile

from setup.models import NodeConfig


class UpstreamSyncBaseModel(models.Model):
    id = models.CharField(max_length=120, default=uuid.uuid4, db_index=True, primary_key=True)
    uuid = models.UUIDField(default=uuid.uuid4, db_index=True)
    localnode = models.CharField(max_length=100, null=True, blank=True)
    synced = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def _get_serialised_value(self, field):
        if type(field) == models.fields.DateTimeField:
            return getattr(self, field.name).isoformat()
        if type(field) == models.fields.BooleanField:
            return getattr(self, field.name)
        if type(field) in [models.fields.files.ImageField, models.fields.files.FileField]:
            file =  getattr(self, field.name)
            if file:
                return file.url
            return None
        if type(field) == models.fields.related.ForeignKey:
            obj = getattr(self, field.name)
            if obj:
                return obj.id
            return ""
        return getattr(self, field.name)

    @classmethod
    def _get_deserialised_value(cls, field, value):
        if type(field) == models.fields.DateTimeField:
            return datetime.fromisoformat(value).astimezone()
        return value if value != "" else None

    def serialise(self):
        fields = self._meta.fields
        my_model_fields = {}
        for field in fields:
            value = self._get_serialised_value(field)
            my_model_fields[field.name] =  value
        return my_model_fields
    
    def _download_image(self, field_name, source_url):
        response = requests.get(source_url)
        filename = source_url.split("/")[-1].split(".")[0] + ".jpg"
        if response.status_code == 200:
            image = PillowImage.open(BytesIO(response.content))
            image = image.convert('RGB')
            image_io = BytesIO()
            image.save(image_io, "jpeg", quality=100)
            file = files.File(image_io, filename)
            getattr(self, field_name).save(filename, file)
            print("SAVED", getattr(self, field_name).url)
        else:
            print("error while downloading image", response.status_code)

    def _download_file(self, field_name, source_url):
        response = requests.get(source_url)
        filename = source_url.split("/")[-1]
        if response.status_code == 200:
            file = files.File(ContentFile(response.content), filename)
            getattr(self, field_name).save(filename, file)
            print("SAVED", getattr(self, field_name).url)
        else:
            print("error", response.status_code)


    @classmethod
    def deserialise_into_object(cls, model, data:dict, download_files=True):
        if not isinstance(data, dict):
            print("Valid data type. Expected dict but got ", type(data))
            return None
    
        parameters = {}
        unique_parameters = {}
        for key, value in data.items():
            if not hasattr(model, key): continue
            field = getattr(model, key).field
            if type(field) in [models.fields.files.ImageField, models.fields.files.FileField]:
                continue
            if type(field) == models.fields.related.ForeignKey:
                key += "_id"
            if field.unique:
                unique_parameters[key] = cls._get_deserialised_value(field, value)
            parameters[key] = cls._get_deserialised_value(field, value)
        
        exists = model.objects.filter(**unique_parameters).exists()
        if exists:
            all(map(parameters.pop, unique_parameters))
            model.objects.filter(**unique_parameters).update(**parameters)
        else:
            model.objects.create(**parameters)
        obj = model.objects.filter(**unique_parameters).first()
        
        # Download files
        if download_files:
            config, _ = NodeConfig.objects.get_or_create()
            host = config.up_stream_host
            for field in obj._meta.fields:
                if type(field) == models.fields.files.ImageField and data.get(field.name):
                    source_url = host +  data.get(field.name)
                    source_url = source_url.replace("//assets", "/assets")
                    obj._download_image(field.name, source_url)

                if type(field) ==  models.fields.files.FileField and data.get(field.name):
                    source_url = host +  data.get(field.name)
                    source_url = source_url.replace("//assets", "/assets")
                    obj._download_file(field.name, source_url)
        return obj
