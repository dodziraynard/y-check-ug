import json
import logging
from datetime import datetime
import math
from rest_framework import generics, permissions
from django.contrib.contenttypes.models import ContentType
from rest_framework.response import Response
from dashboard.models.mixin import UpstreamSyncBaseModel
from accounts.models import User

logger = logging.getLogger(__name__)

QUERY_PAGE_SIZE = 1000


class UpstreamSyncModelView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, model_name):
        data_items = request.data.get("data_items")
        data_items = json.loads(data_items)

        # Get the model
        content_type = ContentType.objects.filter(model=model_name).first()
        if not content_type:
            message = {"message": "Model not found"}
            raise Response(message)

        Model = content_type.model_class()
        success_ids = []
        error_message = None
        for item in data_items:
            try:
                # File uploads will be done via: UpstreamFileUpload
                object = UpstreamSyncBaseModel.deserialise_into_object(
                    Model, item, download_files=False)
                if object:
                    success_ids.append(object.id)
            except Exception as e:
                error_message = str(e)
                logger.error("Error", str(e))

        response_data = {
            "success_ids": success_ids,
            "error_message": error_message,
        }
        return Response(response_data)


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

        objects = Model.objects.all()
        if Model == User:
            objects = objects.order_by("updated_by", "created_by")

        if hasattr(Model, "created_at"):
            objects = objects.order_by("created_at")

        if created_at_offset and hasattr(Model, "created_at"):
            created_at_offset = datetime.fromisoformat(
                created_at_offset).astimezone()
            objects = objects.filter(created_at__gt=created_at_offset)

        # Pagination
        page = request.GET.get("page", "")
        page_size = request.GET.get("page_size", "")
        page_size = int(
            page_size) if page_size.isnumeric() else QUERY_PAGE_SIZE
        total_pages = max(1, math.ceil(objects.count() / page_size))

        page = int(page) if page.isnumeric() else 1
        if page > total_pages:
            page = total_pages
        page = max(page, 1)

        paginated_objects = objects[(page - 1) * page_size:page * page_size]
        prev_page = page - 1 if page > 1 else None
        next_page = page + 1 if total_pages > page else None

        data = [obj.serialise() for obj in paginated_objects]
        response_data = {
            "data": data,
            "page": page,
            "page_size": page_size,
            "total": objects.count(),
            "next_page": next_page,
            "previous_page": prev_page,
            "total_pages": total_pages,
        }
        return Response(response_data)


class UpstreamFileUpload(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, model_name, instance_id):
        file = request.FILES.get("file")
        field_name = request.data.get("field_name")

        # Get the model
        content_type = ContentType.objects.filter(model=model_name).first()
        if not content_type:
            message = {"message": "Model not found"}
            return Response(message)

        Model = content_type.model_class()
        instance = Model.objects.filter(id=instance_id).first()
        if not instance:
            logger.error("%s object with id %s not found.", model_name,
                         instance_id)
            message = {
                "error_message":
                f"{model_name} object with id {instance_id} not found."
            }
            return Response(message)

        setattr(instance, field_name, file)
        instance.save()

        response_data = {
            "success": True,
            "error_message": None,
        }
        return Response(response_data)


class UpstreamSyncModelDeleteView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data_items = request.data.get("data_items")
        data_items = json.loads(data_items)

        success_ids = []
        for item in data_items:
            model_name = item.get("model_name")
            object_id = item.get("object_id")

            # Get the model
            content_type = ContentType.objects.filter(model=model_name).first()
            if not content_type:
                message = {"message": "Model not found"}
                raise Response(message)

            Model = content_type.model_class()
            objects = Model.objects.filter(id=object_id)
            if objects.delete()[0] or not objects.exists():
                success_ids.append(object_id)

        response_data = {
            "success_ids": success_ids,
        }
        return Response(response_data)
