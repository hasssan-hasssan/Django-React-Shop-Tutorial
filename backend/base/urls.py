from django.urls import path
from . import views

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('', views.getRoutes, name='getRoutes'),
    path('products/', views.getProducts, name='getProducts'),
    path('products/<str:pk>/', views.getProduct, name='getProduct'),

    path('users/login/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('users/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('users/profile/', views.getUserProfile, name='users-profile'),
    path('users/', views.getUsers, name='users'),
    path('users/register/', views.registerUser, name='register')
]
