from django.urls import path
from .views import (ProfileView, LoginView, LogoutView, UserRegistrationView, 
GetSecurityQuestionView, PasswordResetView, PasswordResetConfirmView,GetAllSecurityQuestionsView,
BasicSchoolView,SNRSchoolView,CommunityView,)

urlpatterns = [
    path('profile/', ProfileView.as_view(), name='profile_view'),
    path('login-view/', LoginView.as_view(), name='login'),
    path('register-view/', UserRegistrationView.as_view(), name='register'),
    path('all_security_questions/', GetAllSecurityQuestionsView.as_view(), name='all_security_questions'),
    path('security-question/<int:pk>/', GetSecurityQuestionView.as_view(), name='get_security_question'),
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('basic-school/', BasicSchoolView.as_view(), name='basic-school'),
    path('shs-school/', SNRSchoolView.as_view(), name='shs-school'),
    path('community/', CommunityView.as_view(), name='community'),
]
