import uuid
from datetime import datetime
from django.db import models


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
        if type(field) == models.fields.related.ForeignKey:
            return getattr(self, field.name).id
        return str(getattr(self, field.name))

    @classmethod
    def _get_deserialised_value(cls, field, value):
        if type(field) == models.fields.DateTimeField:
            return datetime.fromisoformat(value).astimezone()
        return value

    def serialise(self):
        fields = self._meta.fields
        my_model_fields = {field.name:self._get_serialised_value(field) for field in fields}
        return my_model_fields

    @classmethod
    def deserialise_into_object(cls, model, data:dict):
        if not isinstance(data, dict): return None
        
        parameters = {}
        for key, value in data.items():
            if not hasattr(model, key): continue
            field = getattr(model, key).field
            if type(field) == models.fields.related.ForeignKey:
                key += "_id"
            parameters[key] = cls._get_deserialised_value(field, value)
        return model(**parameters)

