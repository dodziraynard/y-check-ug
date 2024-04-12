import logging
from rest_framework import permissions
from rest_framework import generics, permissions
from rest_framework.response import Response
from ycheck.utils.functions import get_all_user_permissions
from rest_api.serializers import UserSerializer
from knox.models import AuthToken


class ChangeOwnPassword(generics.GenericAPIView):
    """
    Change password of personal user accounts.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        user = request.user
        if old_password and new_password and user and user.check_password(old_password):
            user.set_password(new_password)
            user.changed_password = True
            user.save()

            AuthToken.objects.filter(user=user).delete()
            response_data = {
                "error_message": None,
                "user": UserSerializer(user, context={"request": request}).data,
                "token": AuthToken.objects.create(user)[1],
                "user_permissions": get_all_user_permissions(user),
                "message": "User password changed sucessfully."
            }
            logging.info("$s changed password.", str(user))
        elif user:
            response_data = {
                "error_message": "Invalid old password."
            }
            logging.info("$s password change failed.", str(user))
        else:
            response_data = {
                "error_message": "Invalid session. Please logout and login again."
            }
        return Response(response_data)
