from datetime import timedelta
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from django.db.models import Q, Count, Case, When, IntegerField, F

from .models import Album
from .serializers import AlbumSerializer, AlbumCreateSerializer
from apps.artists.models import Artist


class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ['title']

    def get_queryset(self):
        if self.action == 'list':
            artist_id = self.request.query_params.get('artist_id')
            if artist_id:
                artist = get_object_or_404(Artist, pk=artist_id)
                return Album.objects.for_artist_profile(artist, self.request.user)
            return Album.objects.published()

        return super().get_queryset()

    def get_object(self):
        obj = super().get_object()

        if self.action == 'retrieve' and not obj.is_published:
            if not ((
                            self.request.user.is_artist and self.request.user.artist == obj.artist) or self.request.user.is_staff):
                raise PermissionDenied("You do not have permission to view this album.")

        if self.action in ['update', 'partial_update', 'destroy']:
            if not ((
                            self.request.user.is_artist and self.request.user.artist == obj.artist) or self.request.user.is_staff):
                raise PermissionDenied("You do not have permission to modify this album.")

        return obj

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return AlbumCreateSerializer
        return AlbumSerializer

    @action(detail=False, methods=['get'], url_path='trending')
    def trending(self, request):

        limit = int(request.query_params.get('limit', 1))
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        sixty_days_ago = now - timedelta(days=60)

        albums = Album.objects.filter(is_published=True).select_related(
            'artist'
        ).prefetch_related('tracks').annotate(
            recent_plays=Count(
                'tracks__plays',
                filter=Q(tracks__plays__played_at__gte=thirty_days_ago)
            ),
            previous_plays=Count(
                'tracks__plays',
                filter=Q(
                    tracks__plays__played_at__gte=sixty_days_ago,
                    tracks__plays__played_at__lt=thirty_days_ago
                )
            ),
            growth=Case(
                When(recent_plays__isnull=True, then=0),
                When(previous_plays__isnull=True, then=F('recent_plays')),
                default=F('recent_plays') - F('previous_plays'),
                output_field=IntegerField()
            )
        ).order_by('-growth')[:limit]

        serializer = self.get_serializer(albums, many=True, context={'request': request})
        return Response(serializer.data)


