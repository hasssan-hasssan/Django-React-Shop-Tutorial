from django.urls import path
from base.views import air_views as views

# Define URL patterns specifically for air-related operations
urlpatterns = [
    # URL for handling the Zibal payment gateway callback
    path('result/', views.zibalCallback, name='zibalCallback')  # Maps 'result/' to the zibalCallback view
]
