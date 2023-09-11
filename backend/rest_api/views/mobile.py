import datetime
import json
import logging
from django.utils.timezone import make_aware

from django.contrib.auth import authenticate
from knox.models import AuthToken
from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from accounts.models import Adolescent
from ycheck.utils.functions import apply_filters
from dashboard.models.models import CheckupLocation

from ycheck.utils.functions import get_all_user_permissions
from rest_api.serializers import (LoginSerializer,
                                  CheckupLocationSerializer,
                                  AdolescentSerializer,
                                  RegisterSerializer, UserSerializer)

logger = logging.getLogger("app")


class UserLoginAPI(generics.GenericAPIView):
    """
    Login a user and return a token for the user.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            for field in list(e.detail):
                error_message = e.detail.get(field)[0]
                field = field + ":" if field != "non_field_errors" else ""
                response_data = {
                    "error_message": f"{field}{error_message}",
                    "user": None,
                    "token": None,
                }
                return Response(response_data, status=status.HTTP_200_OK)

        user = serializer.validated_data
        user.save()
        AuthToken.objects.filter(user=user).delete()

        response_data = {
            "error_message": None,
            "user": UserSerializer(user).data,
            "token": AuthToken.objects.create(user)[1],
        }
        return Response(response_data, status=status.HTTP_200_OK)


class UserRegistrationAPI(generics.GenericAPIView):
    """
    Register a new user and return a token for the user.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        request_data = request.data.copy()
        serializer = self.get_serializer(data=request_data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            for field in list(e.detail):
                error_message = e.detail.get(field)[0]
                response_data = {
                    "error_message": f"{field}: {error_message}",
                    "user": None,
                    "token": None,
                }
                return Response(response_data, status=status.HTTP_200_OK)
        user = serializer.save()

        AuthToken.objects.filter(user=user).delete()
        response_data = {
            "error_message": None,
            "user": UserSerializer(user).data,
            "token": AuthToken.objects.create(user)[1],
            "user_permissions": get_all_user_permissions(user)
        }
        return Response(response_data, status=status.HTTP_200_OK)


class UpdateUserObject(generics.GenericAPIView):
    """
    Register a new user and return a token for the user.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        user_data = request.data.get("user_data")
        user = request.user

        for key, value in json.loads(user_data).items():
            if hasattr(user, key):
                setattr(user, key, value)

        user.save()
        response_data = {
            "error_message": None,
            "user": UserSerializer(user).data,
        }
        return Response(response_data, status=status.HTTP_200_OK)


class UserChangePassword(generics.GenericAPIView):
    """
    Change the password of a user and return a token for the user.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        user = authenticate(request,
                            username=request.user.username,
                            password=old_password)
        if user:
            user.set_password(new_password)
            user.save()
            AuthToken.objects.filter(user=user).delete()

            response_data = {
                "error_message": None,
                "user": UserSerializer(user).data,
                "token": AuthToken.objects.create(user)[1],
            }
            return Response(response_data, status=status.HTTP_200_OK)

        else:
            response_data = {
                "error_message": "Invalid old password",
                "user": None,
                "token": None,
            }
            return Response(response_data, status=status.HTTP_200_OK)


class GetCheckupLocation(generics.GenericAPIView):
    """
    Retrieve a list of checkup locations.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CheckupLocationSerializer

    def get(self, request, *args, **kwargs):
        locations = CheckupLocation.objects.filter()
        filters = request.GET.getlist("filters")
        locations = apply_filters(locations,  filters)
        response_data = {"checkup_locations": self.serializer_class(
            locations, many=True).data,
        }
        return Response(response_data)


class Adolescents(generics.GenericAPIView):
    """
    Retrieve a list of checkup locations.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AdolescentSerializer

    def get(self, request, *args, **kwargs):
        query = request.GET.get("query")
        filters = request.GET.getlist("filters")
        adolescents = Adolescent.objects.filter()
        if query:
            adolescents = adolescents.filter(
                Q(pid__icontains=query) |
                Q(surname__icontains=query) |
                Q(other_names__icontains=query)
            )
        adolescents = apply_filters(adolescents,  filters)

        response_data = {"adolescents": self.serializer_class(
            adolescents, context={"request": request}, many=True).data,
        }
        return Response(response_data)

    def post(self, request, *args, **kwargs):
        adolescent_data = request.data.get("adolescent_data")
        adolescent_data = json.loads(adolescent_data)
        dob = adolescent_data.pop("dob")
        dob = datetime.datetime.fromtimestamp(dob/1000.0)
        adolescent_data["dob"] = make_aware(dob)
        uuid = adolescent_data.pop("uuid")
        adolescent_data.pop("id")
        adolescent_data.pop("pid", None)

        adolescent, _ = Adolescent.objects.get_or_create(uuid=uuid)
        for key, value in adolescent_data.items():
            if hasattr(adolescent, key) and value:
                setattr(adolescent, key, value)
        adolescent.save()
        response_data = {
            "adolescent": AdolescentSerializer(adolescent, context={"request": request}).data,
            "error_message": "",
            "message": "Adolescent created successfully.",
        }
        return Response(response_data)


class UploadAdolescentPhoto(generics.GenericAPIView):
    """
    Retrieve a list of checkup locations.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AdolescentSerializer

    def post(self, request, *args, **kwargs):
        uuid = request.data.get("uuid")
        file = request.FILES.get("file")

        adolescent = Adolescent.objects.filter(uuid=uuid).first()
        if adolescent:
            adolescent.picture = file
            adolescent.save()
        else:
            return Response({}, 404)

        response_data = {
            "adolescent": AdolescentSerializer(adolescent, context={"request": request}).data,
            "error_message": "",
            "message": "Photo uploaded successfully.",
        }
        return Response(response_data)
