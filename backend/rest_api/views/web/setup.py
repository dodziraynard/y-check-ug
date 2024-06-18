from rest_framework import generics, permissions, status
from rest_api.permissions import APILevelPermissionCheck
from rest_framework.response import Response
from rest_api.serializers import *
from dashboard.forms import *
from rest_api.views.mixins import SimpleCrudMixin
from django.contrib.auth.models import Group, Permission
from ycheck.utils.functions import relevant_permission_objects, get_errors_from_form
from accounts.models import User
from dashboard.models import *
from rest_framework import generics
from django.contrib.auth import authenticate
from django.db.models import Q
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator

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
    required_permissions = []

    serializer_class = FacilitySerializer
    model_class = Facility
    form_class = FacilityForm
    response_data_label = "facility"
    response_data_label_plural = "facilities"
    order_by = "name"


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
    order_by = "name"


class FlagsAPI(SimpleCrudMixin):
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]

    serializer_class = FlagLabelSerializer
    model_class = FlagLabel
    response_data_label = "summary_flag"
    response_data_label_plural = "summary_flags"


class UpdateUserBioAPI(SimpleCrudMixin):
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]

    model_class = User
    form_class = UserBioDataForm
    serializer_class = UserSerializer
    response_data_label = "bio"
    response_data_label_plural = "bios"

    def post(self, request, *args, **kwargs):
        user_id = request.data.get("id")
        user = User.objects.filter(id=user_id).first()

        if user:
            form = self.form_class(request.data, instance=user)
        if form.is_valid():
            user = form.save()
            return Response({
                "message":
                f"{self.model_class.__name__} Updated successfully",
                self.response_data_label:
                self.serializer_class(form.instance).data,
            })
        return Response({
            "message": f"{self.model_class.__name__} could not be Updated",
            "error_message": get_errors_from_form(form),
        })


class ChangePasswordAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]

    def post(self, request, *args, **kwargs):
        user_id = request.data.get("id")
        password = request.data.get("password")
        new_password = request.data.get("new_password")
        user = User.objects.filter(id=user_id).first()
        check_user = authenticate(request,
                                  username=user.username,
                                  password=password)

        if check_user and len(new_password) > 0:
            check_user.set_password(new_password)
            check_user.save()
            response_data = {
                "message": "Password Changed Successfully",
            }
            return Response(response_data, status=status.HTTP_200_OK)

        else:
            response_data = {
                "error_message": "Invalid old password",
            }
            return Response(response_data, status=status.HTTP_200_OK)


class UploadPictureAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]

    def post(self, request, *args, **kwargs):
        user_id = request.data.get("id")
        picture = request.data.get("picture")
        user = User.objects.filter(id=user_id).first()
        if user:
            user.photo = picture
            user.save()
            return Response({
                "message":
                f" Profile Picture Updated successfully",
            })
        return Response({
            "error_message":
            "Profile Picture Could not be Updated successfully",
        })


class AllNodeAPI(SimpleCrudMixin):
    """
    get all node configurations.
    """
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]
    required_permissions = ["setup.manage_setup"]

    serializer_class = NodeConfigSerializer
    model_class = NodeConfig
    response_data_label = "nodeconfig"
    response_data_label_plural = "nodeconfigs"


class UploadApkAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]

    def post(self, request, *args, **kwargs):
        file = request.data.get("file")

        if file:
            config = AppConfiguration.get_current_configuration()
            config.android_apk = file
            config.save()
            return Response({
                "message": "APK file uploaded successfully",
            })
        else:
            return Response({
                "error_message": "APK file could not be uploaded",
            })


class GetApk(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        config = AppConfiguration.objects.first()
        if config:
            return Response({
                "message": "Web app configurations",
                "configurations": {
                    "android_apk_url":
                    request.build_absolute_uri(config.android_apk.url)
                    if config.android_apk else "",
                    "version":
                    config.current_apk_versions,
                }
            })
        return Response({}, 404)


class PendingReferralNotifications(generics.GenericAPIView):
    """
    Get the count of pending referrals for user's facility.
    """
    permission_classes = [permissions.IsAuthenticated, APILevelPermissionCheck]

    def get(self, request, *args, **kwargs):
        referrals = Referral.objects.all().order_by("-created_at")
        if not request.user.has_perm("setup.access_all_referrals"):
            referrals = referrals.filter(
                Q(facility=request.user.facility)
                & (Q(status="new") | Q(status="review")))
            referrals_serializer = ReferralSerializer(referrals, many=True)
            total_pending_referral_count = len(referrals_serializer.data)
            return Response({
                "total_pending_referral_count":
                total_pending_referral_count,
            })
        else:
            referrals = referrals.filter(
                (Q(status="new") | Q(status="review")))
            referrals_serializer = ReferralSerializer(referrals, many=True)
            total_pending_referral_count = len(referrals_serializer.data)
            return Response({
                "total_pending_referral_count":
                total_pending_referral_count,
            })


class FlagColourDistributionTypeView(generics.GenericAPIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        red_flag_code = Colors.RED.value
        categories = ["basic", "secondary", "community"]
        result = []

        for label in FlagLabel.objects.all():
            red_flags = SummaryFlag.objects.filter(final_color_code=red_flag_code, label=label)
            category_counts = {
                category: red_flags.filter(adolescent__type=category).count()
                for category in categories
            }
            total_red_flags = sum(category_counts.values())
            if total_red_flags > 0:
                result.append({
                    "name": label.name,
                    "Total Red Flags": total_red_flags,
                    **category_counts
                })

        response_data = {"red_flag_distribution": result}
        return Response(response_data)