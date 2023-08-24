from . import views
from django.urls import path

urlpatterns = [
    path('api/login-view/', views.loginView, name='login'),
    path('api/register-view/', views.userRegistration, name='register'),
]
