from rest_framework import permissions

class CanManageSetupPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.has_perm("setup.manage_setup")
    

class CanManageUsersPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.has_perm("setup.manage_users")