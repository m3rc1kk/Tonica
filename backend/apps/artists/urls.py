from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('artists', views.ArtistViewSet, basename='artists')
router.register('applications/admin', views.ArtistApplicationAdminViewSet, basename='artist-applications')

urlpatterns = [
    path('application/apply/', views.ArtistApplicationCreateView.as_view(), name='artist-apply'),
    path('', include(router.urls)),
]
