from django.conf import settings
from django.contrib import admin
from django.conf.urls.static import static
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/', include('apps.artists.urls')),
    path('api/v1/', include('apps.albums.urls')),
    path('api/v1/', include('apps.main.urls')),
    path('api/v1/favorites/', include('apps.favorites.urls')),
    path('api/v1/pins/', include('apps.pins.urls')),
    path('api/v1/', include('apps.playlists.urls')),
    path('api/v1/', include('apps.genres.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
