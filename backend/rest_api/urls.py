from django.urls import path
from rest_api import views


app_label = "rest_api"
urlpatterns = [
    path("auth/login/", views.UserLoginAPI.as_view()),
    path("auth/register/", views.UserRegistrationAPI.as_view()),
    path("auth/update-user/", views.UpdateUserObject.as_view()),
    path("auth/change-password/", views.UserChangePassword.as_view()),
    path("checkup-location/", views.GetCheckupLocation.as_view()),
    path("adolescents/", views.Adolescents.as_view()),
    path("upload-adolescent-photo/", views.UploadAdolescentPhoto.as_view()),
    path("get-survey-questions/", views.GetSurveyQuestions.as_view()),
    path("post-survey-response/", views.RespondToSurveyQuestion.as_view()),
]
