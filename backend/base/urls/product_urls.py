from django.urls import path
from base.views import product_views as views

# Define URL patterns specifically for product-related operations
urlpatterns = [
    # URL for retrieving the list of all products
    path('', views.getProducts, name='getProducts'),

    # URL for retrieving details of a specific product by its primary key (pk)
    path('<str:pk>/', views.getProduct, name='getProduct'),
]
