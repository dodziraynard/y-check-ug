from django.urls import path
from rest_api import views

# yapf: disable

app_label = "rest_api"
urlpatterns = [
    path("mobile-config/", views.MobileConfigAPI.as_view()),
    path("auth/login/", views.UserLoginAPI.as_view()),
    path("auth/logout/", views.UserLogoutAPI.as_view()),
    path("auth/register/", views.UserRegistrationAPI.as_view()),
    path("auth/update-user/", views.UpdateUserObject.as_view()),
    path("auth/change-password/", views.UserChangePassword.as_view()),
    path("auth/change-own-password/", views.ChangeOwnPassword.as_view()),

    path("checkup-location/", views.GetCheckupLocation.as_view()),
    path("adolescents/", views.MobileAdolescentsAPI.as_view()),
    path("upload-adolescent-photo/", views.UploadAdolescentPhoto.as_view()),
    path("get-survey-questions/", views.GetSurveyQuestions.as_view()),
    path("get-multiple-questions/", views.GetNextAvailableQuestions.as_view()),
    path("post-survey-response/", views.RespondToSurveyQuestion.as_view()),
    path("post-multiple-responses/", views.PostMutipleResponses.as_view()),

    # Adolescents
    path("web-adolescents/", views.AdolescentsAPI.as_view()),
    path("adolescent-profile/<str:pid>/", views.GetAdolescentProfile.as_view()),
    path("<str:pid>/summary-flags/",
         views.GetSummaryFlags.as_view(), name="summary_flags"),
    path("<str:pid>/recommended-services/",
         views.GetRecommendedServices.as_view()),
    path("web-adolescents-types/", views.GetAdolescentType.as_view()),

    path("<str:pid>/referrals/", views.AdolescentReferrals.as_view()),
    path("referrals/<str:referral_id>/detail/", views.ReferralDetail.as_view()),
    path("referrals/<str:referral_id>/treatment-feedback/",
         views.ReferralTreatment.as_view()),
    path("treatments/", views.TreatmentsAPI.as_view()),
    path("my-referrals/", views.MyReferrals.as_view()),

    # Facilities
    path("facilities/", views.FacilitiesAPI.as_view()),
    path("all/facilities/", views.AllFacilitiesAPI.as_view()),
    path("all-nodes/", views.AllNodeAPI.as_view()),
    path("pending/referrals/notification/", views.PendingReferralNotifications.as_view()),

    # Groups
    path("groups/", views.GroupsAPI.as_view()),

    # Permissions
    path("permissions/group/<int:group_id>/", views.PermissionsAPI.as_view()),

    # Users
    path("users/", views.UsersAPI.as_view()),
    path("user/bio/data/", views.UpdateUserBioAPI.as_view()),
    path("user/change/password/", views.ChangePasswordAPI.as_view()),
    path("user/upload/picture/", views.UploadPictureAPI.as_view()),

    # services
    path("services/", views.ServicesAPI.as_view()),
    path("get-flags/", views.FlagsAPI.as_view()),
    path("get-schools/", views.GetSchoolsAPI.as_view()),

    # Syncing
    path("sync/download/<str:model_name>/", views.DownStreamSyncModelView.as_view()),
    path("sync/upload/<str:model_name>/", views.UpstreamSyncModelView.as_view()),
    path("sync/upload-file/<str:model_name>/<str:instance_id>", views.UpstreamFileUpload.as_view()),
    path("sync/delete-entities/", views.UpstreamSyncModelDeleteView.as_view()),

    # apk
    path("upload-apk/", views.UploadApkAPI.as_view()),
    path("get-apk/", views.GetApk.as_view()),

]

# Misc URLs
urlpatterns += [
    path("record-activity-time/", views.RecordAdolescentActivityTime.as_view()),
    path("adolescent-activity/", views.AdolescentActivityView.as_view()),
    path("adolescent-flag-check/<str:pid>", views.AdolescentFlagCheckView.as_view()),
    path("update-adolescent-status/<str:pid>", views.UpdateAdolescentStatus.as_view()),
    path("reports/<int:table_number>/", views.TableReportsView.as_view()),
    path("adolescent-flags/", views.AllAdolescentsFlagCheckView.as_view()),
    path("flag-colour-distribution/", views.FlagColourDistributionView.as_view()),
    path("basic-demographics/", views.BasicDemographics.as_view()),
    path("secondary-demographics/", views.SecondaryDemographics.as_view()),
    path("community-demographics/", views.CommunityDemographics.as_view()),
    path("age-distributions/", views.AgeDistributionDemographics.as_view()),
    path("positive-screened/", views.PositiveScreenedView.as_view()),
]
