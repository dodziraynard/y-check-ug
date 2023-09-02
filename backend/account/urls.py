from . import views
from django.urls import path

urlpatterns = [
    path('api/token/', views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
]
