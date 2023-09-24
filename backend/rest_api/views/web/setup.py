from rest_framework import generics, permissions, status
from rest_api.permissions import APILevelPermissionCheck
from rest_framework.response import Response
from rest_api.serializers import (GroupSerializer)
from dashboard.forms import GroupForm
from rest_api.views.mixins import SimpleCrudMixin
from django.contrib.auth.models import Group, Permission

class GroupsAPI(SimpleCrudMixin):
    """
    Groups API: Create groups to manage users.
    """
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = [
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
