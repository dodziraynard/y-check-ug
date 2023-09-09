from django.urls import path
from rest_api import views


app_label = "rest_api"
urlpatterns = [
    path("auth/login/", views.UserLoginAPI.as_view()),
    path("auth/register/", views.UserRegistrationAPI.as_view()),
    path("auth/update-user/", views.UpdateUserObject.as_view()),
    path("auth/change-password/", views.UserChangePassword.as_view()),



    # path("auth/change_password/", views.UserChangePassword.as_view()),
    # path("auth/logout/", views.UserLogoutAPI.as_view()),
    # path("auth/profile/", views.MyProfile.as_view()),
    # path("participants/", views.CreateParticipantAPI.as_view()),
    # path("get-mobile-app-configurations/",
    #      views.MobileAppConfigurationAPI.as_view()),
    # path("get-assigned-images/", views.GetAssignedImagesAPI.as_view()),
    # path("upload-audio/", views.UploadAudioAPI.as_view()),
    # path("auth/user-permissions/", views.MyPermissions.as_view()),
    # path("auth/logout/", views.LogoutApiView.as_view()),
    # path("search-users", views.SearchUser.as_view()),
    # path("archive-user/", views.ArchiveUser.as_view()),
    # path("user-statistics/", views.GetUserStatistics.as_view()),
]
