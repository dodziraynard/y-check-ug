from django.urls import path
from .views import (ProfileView, LoginView, LogoutView, UserRegistrationView, GetAllSecurityQuestionsView,
GetSecurityQuestionView, PasswordResetView, PasswordResetConfirmView, SecurityQuestionSetupView)

urlpatterns = [
    path('profile/', ProfileView.as_view(), name='profile_view'),
    path('login-view/', LoginView.as_view(), name='login'),
    path('register-view/', UserRegistrationView.as_view(), name='register'),
    path('security-questions/', GetAllSecurityQuestionsView.as_view(), name='get-security-questions'),
    path('security-question/<int:pk>/', GetSecurityQuestionView.as_view(), name='get_security_question'),
    path('security-question-setup/', SecurityQuestionSetupView.as_view(), name='security-question-setup'),
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
