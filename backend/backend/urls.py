from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/products/', include('base.urls.product_urls')),
    path('api/v1/orders/', include('base.urls.order_urls')),
    path('api/v1/users/', include('base.urls.user_urls')),
    path('api/v1/air/', include('base.urls.air_urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
