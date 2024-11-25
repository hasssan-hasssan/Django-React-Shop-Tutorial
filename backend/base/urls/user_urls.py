from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from base.views import user_views as views

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('profile/', views.getUserProfile, name='users-profile'),
    path('profile/update/',
         views.updateUserProfile,
         name='user-profile-update'),
    path('', views.getUsers, name='users'),
    path('register/', views.registerUser, name='register'),
    path('verify-email/<str:token>/', views.verifyEmail, name='verifyEmail')
]
