from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArtistApplicationCreateView, ArtistApplicationAdminViewSet

router = DefaultRouter()
router.register('applications', ArtistApplicationAdminViewSet, basename='artist-applications')

urlpatterns = [
    path('apply/', ArtistApplicationCreateView.as_view(), name='artist-apply'),
    path('admin/', include(router.urls)),
]