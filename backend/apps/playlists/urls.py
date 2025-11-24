from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('playlists', views.PlaylistViewSet, basename='playlists')

urlpatterns = [
    path('', include(router.urls)),
]