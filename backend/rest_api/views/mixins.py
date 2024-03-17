from datetime import datetime
import math

from rest_framework import generics
from rest_framework.response import Response
from django.utils.timezone import make_aware

from ycheck.utils.functions import apply_filters, get_errors_from_form

QUERY_PAGE_SIZE = 10


class SimpleCrudMixin(generics.GenericAPIView):

    def get(self, request, *args, **kwargs):
        filters = request.GET.getlist("filters")
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        query = request.GET.get("query") or request.GET.get("q")

        objects = self.model_class.objects.all()
        if filters:
            objects = apply_filters(objects, filters)
        if query and hasattr(self.model_class,
                             "generate_query"):  # type: ignore
            objects = objects.filter(
                self.model_class.generate_query(query))  # type: ignore

        if hasattr(self.model_class, "created_at"):
            objects = objects.order_by("-created_at")
            if start_date:
                start_date = datetime.strptime(start_date, '%Y-%m-%d')
                objects = objects.filter(
                    created_at__gte=make_aware(start_date))
            if end_date:
                end_date = datetime.strptime(end_date, '%Y-%m-%d')
                objects = objects.filter(created_at__lte=make_aware(end_date))

        if hasattr(self.model_class, "deleted"):  # type: ignore
            objects = objects.filter(deleted=False)

        if hasattr(self, "modify_response_data"):
            objects = self.modify_response_data(objects, request)

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

        # yapf: disable
        response_data = {
            self.response_data_label_plural:
            self.serializer_class(paginated_objects, context={
                                  "request": request}, many=True).data,
            "page": page,
            "page_size": page_size,
            "total": objects.count(),
            "next_page": next_page,
            "previous_page": prev_page,
            "total_pages": total_pages,
        }
        return Response(response_data)

    def post(self, request, *args, **kwargs):
        obj_id = request.data.get("id")
        obj = None
        if obj_id:
            obj = self.model_class.objects.filter(id=obj_id).first()
        form = self.form_class(request.data, instance=obj)
        if form.is_valid():
            form.save()
            return Response({
                "message":
                f"{self.model_class.__name__} saved successfully",
                self.response_data_label:
                self.serializer_class(form.instance).data,
            })
        return Response({
            "message": f"{self.model_class.__name__} could not be saved",
            "error_message": get_errors_from_form(form),
        })

    def delete(self, request, *args, **kwargs):
        obj_id = request.data.get("id")
        obj = self.model_class.objects.filter(id=obj_id).first()
        if obj:
            try:
                if hasattr(obj, "deleted"):
                    obj.deleted = True
                    if hasattr(obj, "note"):
                        obj.note = "WEB_DELETED"
                    obj.save()
                else:
                    obj.delete()
                return Response({
                    "success_message":
                    f"{self.model_class.__name__} deleted successfully"
                })
            except Exception as e:
                return Response({
                    "error_message":
                    f"{self.model_class.__name__} could not be deleted: {e}"
                })
        return Response({
            "error_message":
            f"{self.model_class.__name__} could not be deleted"
        })
