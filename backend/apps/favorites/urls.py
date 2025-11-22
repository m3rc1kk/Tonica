from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

router.register('tracks', views.FavoriteTrackViewSet, basename='favorite-tracks')
router.register('albums', views.FavoriteAlbumViewSet, basename='favorite-albums')
router.register('artists', views.FavoriteArtistViewSet, basename='favorite-artists')

urlpatterns = [
    path('', include(router.urls)),
]
