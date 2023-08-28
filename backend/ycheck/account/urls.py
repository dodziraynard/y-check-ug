from django.urls import path
from .views import (ProfileView, LoginView, LogoutView, UserRegistrationView, 
GetSecurityQuestionView, PasswordResetView, PasswordResetConfirmView,)

urlpatterns = [
    path('profile/', ProfileView.as_view(), name='profile_view'),
    path('login-view/', LoginView.as_view(), name='login'),
    path('register-view/', UserRegistrationView.as_view(), name='register'),
    path('security-question/<int:pk>/', GetSecurityQuestionView.as_view(), name='get_security_question'),
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
