from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('albums', views.AlbumViewSet, basename='albums')
router.register('artists', views.ArtistViewSet, basename='artists')
router.register('tracks', views.TrackViewSet, basename='track')

admin_router = DefaultRouter()
admin_router.register('applications', views.ArtistApplicationAdminViewSet, basename='artist-applications')

urlpatterns = [
    path('apply/', views.ArtistApplicationCreateView.as_view(), name='artist-apply'),
    path('admin/', include(admin_router.urls)),
    path('', include(router.urls)),
]
