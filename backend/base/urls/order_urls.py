from django.urls import path
from base.views import order_views as views
urlpatterns = [
    path('add/', views.addOrderItems, name='addOrderItems'),
    path('my/', views.getMyOrders, name='getMyOrders'),
    path('<str:pk>/', views.getOrderById, name='getOrderById')
]
