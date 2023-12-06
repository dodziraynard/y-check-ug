import json
from datetime import datetime
from rest_framework import generics, permissions
from django.contrib.contenttypes.models import ContentType
from rest_framework.response import Response
from dashboard.models.mixin import UpstreamSyncBaseModel


class UpstreamSyncModelView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, model_name, instance_uuid):
        model_json = request.data.get("model_json")
        model_dict = json.loads(model_json)

        # Get the model
        content_type = ContentType.objects.filter(model=model_name).first()
        if not content_type:
            message = {"message": "Model not found"}
            raise Response(message)

        Model = content_type.model_class()
        object = UpstreamSyncBaseModel.deserialise_into_object(Model, **model_dict)
        object.save()


class DownStreamSyncModelView(generics.GenericAPIView):
    """Download upstream objects to the downstream nodes."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, model_name):
        created_at_offset = request.GET.get("created_at_offset")

        # Get the model
        content_type = ContentType.objects.filter(model=model_name).first()
        if not content_type:
            message = {"message": "Model not found"}
            return Response(message)
        
        Model = content_type.model_class()

        objects = Model.objects.all().order_by("created_at")
        if created_at_offset:
            created_at_offset = datetime.fromisoformat(created_at_offset).astimezone()
            objects = objects.filter(created_at__gt=created_at_offset)
        
        data = [obj.serialise() for obj in objects]
        return Response({"data": data})
