from django.urls import path
from base.views import order_views as views
urlpatterns = [
    path('add/', views.addOrderItems, name='addOrderItems'),
    path('my/', views.getMyOrders, name='getMyOrders'),
    path('<str:pk>/', views.getOrderById, name='getOrderById'),
    path('<str:pk>/pay/', views.payOrder, name='payOrder'),
    path('<str:token>/inquiry-pay/', views.inquiryPay, name='inquiryPay')
]
