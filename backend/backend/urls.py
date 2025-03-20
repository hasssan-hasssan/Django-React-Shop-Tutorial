from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Define URL patterns for the project
urlpatterns = [
    # Admin panel URL
    path('admin/', admin.site.urls),

    # API endpoint for product-related operations
    path('api/v1/products/', include('base.urls.product_urls')),

    # API endpoint for order-related operations
    path('api/v1/orders/', include('base.urls.order_urls')),

    # API endpoint for user-related operations
    path('api/v1/users/', include('base.urls.user_urls')),

    # API endpoint for air-related operations
    path('api/v1/air/', include('base.urls.air_urls')),
]

# Serve media files in development mode
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
