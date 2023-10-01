from rest_framework import generics, permissions, status
from rest_api.permissions import APILevelPermissionCheck
from rest_framework.response import Response
from rest_api.serializers import (GroupSerializer,
                                  GroupPermissionSerializer
                                  ,UserSerializer,
                                  FacilitySerializer,
                                  ServiceSerializer,
                                  FlagLabelSerializer)
from dashboard.forms import GroupForm,UserForm,FacilityForm,ServiceForm
from rest_api.views.mixins import SimpleCrudMixin
from django.contrib.auth.models import Group, Permission
from ycheck.utils.functions import relevant_permission_objects,get_errors_from_form
from accounts.models import User
from dashboard.models import Facility, Service,FlagLabel
from ycheck.utils.functions import relevant_permission_objects

class GroupsAPI(SimpleCrudMixin):
    """
    Groups API: Create groups to manage users.
    """
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = [
        "setup.manage_setup",
        "auth.add_group",
        "auth.change_group",
        "auth.view_group",
    ]
    serializer_class = GroupSerializer
    model_class = Group
    form_class = GroupForm
    response_data_label = "group"
    response_data_label_plural = "groups"

    def get(self, request):
        groups = Group.objects.all()
        response_data = {
            self.response_data_label_plural:
            self.serializer_class(groups,
                                  context={
                                      "request": request
                                  },
                                  many=True).data,
        }
        return Response(response_data)
    
    
class PermissionsAPI(SimpleCrudMixin):
    """
    Manage group/user permissions.
    """
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = ["setup.manage_setup"]
    serializer_class = GroupPermissionSerializer
    model_class = Permission

    def get(self, request, group_id, *args, **kwargs):
        group = Group.objects.filter(id=group_id).first()
        if not group:
            return Response({"error_message": "Group not found"}, status=404)
        permissions = relevant_permission_objects()

        data = self.serializer_class(permissions,
                                     context={
                                         "group": group
                                     },
                                     many=True).data
        return Response({"permissions": data})

    def post(self, request, group_id, *args, **kwargs):
        group = Group.objects.filter(id=group_id).first()
        if not group:
            return Response({"error_message": "Group not found"}, status=404)
        permission_ids = request.data.get("permissions", [])
        permissions = Permission.objects.filter(id__in=permission_ids)
        group.permissions.set(permissions)
        return Response({"message": "Permissions updated successfully"})


class UsersAPI(SimpleCrudMixin):
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    add_permissions = ["setup.add_user"]
    change_permissions = ["setup.change_user"]
    delete_permissions = ["setup.delete_user"]

    serializer_class = UserSerializer
    model_class = User
    form_class = UserForm
    response_data_label = "user"
    response_data_label_plural = "users"

    def post(self, request, *args, **kwargs):
        is_active = request.data.get("is_active", None)
        obj_id = request.data.get("id")
        new_password = request.data.get("password")
        group_names = request.data.get("groups")
        groups = Group.objects.filter(name__in=group_names)
        obj = None
        created_by = None
        if obj_id:
            obj = self.model_class.objects.filter(id=obj_id).first()
            if is_active != None:
                obj.is_active = is_active
                obj.save()
        else:
            created_by = request.user

        form = self.form_class(request.data, instance=obj)
        if form.is_valid():
            user = form.save()
            if new_password and len(new_password) > 0:
                user.set_password(new_password)
            user.groups.set(groups)
            user.updated_by = request.user
            if created_by:
                user.created_by = created_by
            user.save()

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



class AllFacilitiesAPI(SimpleCrudMixin):
    """
    Permform CRUD on facility.
    """
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = ["setup.manage_facility"]

    serializer_class = FacilitySerializer
    model_class = Facility
    form_class = FacilityForm
    response_data_label = "facility"
    response_data_label_plural = "facilities"

    def get(self, request):
        facilities = Facility.objects.all()
        response_data = {
            self.response_data_label_plural:
            self.serializer_class(facilities,
                                  context={
                                      "request": request
                                  },
                                  many=True).data,
        }
        return Response(response_data)

class ServicesAPI(SimpleCrudMixin):
    """
    Permform CRUD on service.
    """
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = ["setup.manage_service"]

    serializer_class = ServiceSerializer
    model_class = Service
    form_class = ServiceForm
    response_data_label = "service"
    response_data_label_plural = "services"

    def get(self, request):
        services = Service.objects.all()
        response_data = {
            self.response_data_label_plural:
            self.serializer_class(services,
                                  context={
                                      "request": request
                                  },
                                  many=True).data,
        }
        return Response(response_data)
    
    
class FlagLabelAPI(SimpleCrudMixin):
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]

    serializer_class = FlagLabelSerializer
    model_class = FlagLabel
    response_data_label = "flag_label"
    response_data_label_plural = "flag_labels"

    def get(self, request):
        flag_labels = FlagLabel.objects.all()
        response_data = {
            self.response_data_label_plural:
            self.serializer_class(flag_labels,
                                  context={
                                      "request": request
                                  },
                                  many=True).data,
        }
        return Response(response_data)
