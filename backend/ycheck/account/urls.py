from django.urls import path
from account import views

urlpatterns = [
    path('profile/', views.ProfileView.as_view(), name='profile_view'),
    path('login-view/', views.LoginView.as_view(), name='login'),
    path('register-view/', views.UserRegistrationView.as_view(), name='register'),
    path('all_security_questions/', views.GetAllSecurityQuestionsView.as_view(), name='all_security_questions'),
    path('security-question/<int:pk>/', views.GetSecurityQuestionView.as_view(), name='get_security_question'),
    path('password-reset/', views.PasswordResetView.as_view(), name='password-reset'),
    path('password-reset-confirm/', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('basic-school/', views.BasicSchoolView.as_view(), name='basic-school'),
    path('shs-school/', views.SNRSchoolView.as_view(), name='shs-school'),
    path('community/', views.CommunityView.as_view(), name='community'),
    path('basic-school/<int:pk>/', views.BasicSchoolDeleteView.as_view()),
    path('shs-school/<int:pk>/', views.SNRSchoolDeleteView.as_view()),
    path('community/<int:pk>/', views.CommunityDeleteView.as_view()),
    path('Add-adolescent/', views.AddAdolescentView.as_view(), name='Add-adolescent'),

]
