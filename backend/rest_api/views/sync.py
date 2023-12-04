import json
from rest_framework import generics, permissions
from django.contrib.contenttypes.models import ContentType
from rest_framework.response import Response


class UpstreamSyncModelView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, model_name, instance_uuid):
        model_json = request.data.get("model_json")
        model_dict = json.loads(model_json)
        model_dict.pop("id", None)

        # Get the model
        content_type = ContentType.objects.filter(model=model_name).first()
        if not content_type:
            message = {"message": "Model not found"}
            raise Response(message)

        Model = content_type.model_class()
        object_exists = Model.objects.filter(uuid=instance_uuid).exists()
        if not object_exists:
            object = Model.objects.create(**model_dict)
        else:
            Model.objects.filter(uuid=instance_uuid).update(**model_dict)
