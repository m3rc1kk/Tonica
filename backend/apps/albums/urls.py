from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('albums', views.AlbumViewSet, basename='albums')


urlpatterns = [
    path('', include(router.urls)),
]
