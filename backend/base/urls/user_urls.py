from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from base.views import user_views as views

# Define URL patterns specifically for user-related operations
urlpatterns = [
    # URL for obtaining access and refresh tokens for user login
    path('login/', TokenObtainPairView.as_view(), name='token-obtain-pair'),

    # URL for refreshing the JWT access token using a valid refresh token
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # URL for retrieving the profile of the currently authenticated user
    path('profile/', views.getUserProfile, name='users-profile'),

    # URL for updating the profile information of the currently authenticated user
    path('profile/update/', views.updateUserProfile, name='user-profile-update'),

    # URL for retrieving a list of all users
    path('', views.getUsers, name='users'),

    # URL for registering a new user
    path('register/', views.registerUser, name='register'),

    # URL for verifying a user's email using a token
    path('verify-email/<str:token>/', views.verifyEmail, name='verifyEmail'),
]
