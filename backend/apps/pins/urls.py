from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('artists', views.PinnedArtistViewSet, basename='pinned-artists')
router.register('albums', views.PinnedAlbumViewSet, basename='pinned-albums')
router.register('playlists', views.PinnedPlaylistViewSet, basename='pinned-playlists')

urlpatterns = [
    path('', include(router.urls)),
]