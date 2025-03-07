from django.urls import path
from base.views import air_views as views

urlpatterns = [
    path('result/', views.zibalCallback, name='zibalCallback')
]
