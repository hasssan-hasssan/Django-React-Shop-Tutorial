from django.urls import path
from base.views import order_views as views

# Define URL patterns specifically for order-related operations
urlpatterns = [
    # URL for adding new order items
    path('add/', views.addOrderItems, name='addOrderItems'),

    # URL for retrieving the orders of the currently authenticated user
    path('my/', views.getMyOrders, name='getMyOrders'),

    # URL for retrieving details of a specific order by its primary key (pk)
    path('<str:pk>/', views.getOrderById, name='getOrderById'),

    # URL for processing payment for a specific order by its primary key (pk)
    path('<str:pk>/pay/', views.payOrder, name='payOrder'),

    # URL for inquiring about the payment status using a specific token
    path('<str:token>/inquiry-pay/', views.inquiryPay, name='inquiryPay'),
]
