from django.urls import path
from account import views


urlpatterns = [
    path('profile/', views.ProfileView.as_view(), name='profile_view'),
    path('login-view/', views.LoginView.as_view(), name='login'),
    path('register-view/', views.UserRegistrationView.as_view(), name='register'),
    path('security-question/<int:pk>/', views.GetSecurityQuestionView.as_view(), name='get_security_question'),
    path('password-reset/', views.PasswordResetView.as_view(), name='password-reset'),
    path('password-reset-confirm/', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    
    path('all_security_questions/', views.GetAllSecurityQuestionsView.as_view()),
    path('basic-school/', views.BasicSchoolView.as_view()),
    path('shs-school/', views.SNRSchoolView.as_view()),
    path('community/', views.CommunityView.as_view()),
    path('Add-adolescent/', views.AddAdolescentView.as_view()),
    path('home_questions/', views.HomeQuestionView.as_view()),
    path('adolescent-search/', views.SearchAdolescentView.as_view()),
    path('shs-school/<int:pk>/', views.SNRSchoolDeleteView.as_view()),
    path('basic-school/<int:pk>/', views.BasicSchoolDeleteView.as_view()),
    path('community/<int:pk>/', views.CommunityDeleteView.as_view()),
    path('Add-adolescent/<int:pk>/', views.AdolescentDeleteView.as_view()),
    path('save_responses/', views.save_responses.as_view(), name='save_responses'),
    path('responses/', views.ResponsesView.as_view(), ),
    path('save_options/', views.save_options.as_view(), ),
    path('get_options/', views.OptionsView.as_view(), ),
    path('getAllAdolescent/', views.getAllAdolescent.as_view(), ),
    path('getAllUsers/', views.getAllUsers.as_view(), ),
    path('getAdolescentType/', views.getAdolescentType.as_view(), ),
]
