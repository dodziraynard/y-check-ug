from rest_framework import permissions


class APILevelPermissionCheck(permissions.BasePermission):

    def has_permission(self, request, view):
        permissions = getattr(view, "required_permissions", [])
        if request.method == "POST":
            permissions += getattr(view, "add_permissions", [])
            permissions += getattr(view, "change_permissions", [])
        elif request.method == "GET":
            permissions += getattr(view, "view_permissions", [])
        elif request.method == "PUT":
            permissions += getattr(view, "change_permissions", [])
        elif request.method == "DELETE":
            permissions += getattr(view, "delete_permissions", [])

        for permission in permissions:
            if not request.user.has_perm(permission):
                return False
        return True
