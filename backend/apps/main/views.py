from datetime import timedelta

from django.utils import timezone
from django.core.cache import cache

from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.filters import SearchFilter

from apps.genres.models import Genre
from apps.artists.models import Artist
from apps.albums.models import Album

from .models import Track, TrackPlay
from .serializers import TrackSerializer, TrackCreateSerializer

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count, Case, When, IntegerField, F


class TrackViewSet(viewsets.ModelViewSet):
    queryset = Track.objects.all()
    serializer_class = TrackSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ['title']

    def get_queryset(self):
        if self.action == 'list':
            artist_id = self.request.query_params.get('artist_id')
            genre_slug = self.request.query_params.get('genre')
            qs = super().get_queryset().select_related('album', 'album__artist').prefetch_related('genres', 'artists')
            if artist_id:
                artist = get_object_or_404(Artist, pk=artist_id)
                qs = qs.filter(
                    Q(album__artist=artist) | Q(artists=artist)
                ).distinct()
                
                if not (self.request.user.is_artist and self.request.user.artist == artist):
                    qs = qs.filter(album__is_published=True)
            else:
                qs = qs.filter(album__is_published=True)
            
            if genre_slug:
                genre = get_object_or_404(Genre, slug=genre_slug)
                qs = qs.filter(genres=genre)
            
            return qs

        return super().get_queryset()

    def get_object(self):
        obj = super().get_object()

        if not obj.album.is_published:
            if not ((self.request.user.is_artist and self.request.user.artist == obj.album.artist) or self.request.user.is_staff):
                raise PermissionDenied("You do not have permission to view this track.")

        if self.action in ['update', 'partial_update', 'destroy']:
            if not ((
                            self.request.user.is_artist and self.request.user.artist == obj.album.artist) or self.request.user.is_staff):
                raise PermissionDenied("You do not have permission to modify this track.")

        return obj

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return TrackCreateSerializer
        return TrackSerializer

    def destroy(self, request, *args, **kwargs):
        track = self.get_object()
        album = track.album
        response = super().destroy(request, *args, **kwargs)

        tracks_count = album.tracks.count()
        if tracks_count > 1:
            album.album_type = 'album'
        else:
            album.album_type = 'single'
        album.save()
        
        return response

    @action(detail=True, methods=['post'])
    def play(self, request, pk=None):
        track = self.get_object()
        TrackPlay.objects.create(
            track=track,
            user=request.user,
        )

        return Response({
            'status': 'Play registered',
            'track_id': track.id,
            'plays_count_30_days': track.get_plays_count_30_days(),
        }, status=status.HTTP_201_CREATED)


    @action(detail=False, methods=['get'], url_path='trending')
    def trending(self, request):
        limit = int(request.query_params.get('limit', 4))
       
        cache_version = cache.get('tracks:trending:version', 1)
        cache_key = f'tracks:trending:limit:{limit}:v{cache_version}'

        cached_data = cache.get(cache_key)
        if cached_data is not None:
            return Response(cached_data)
        
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        sixty_days_ago = now - timedelta(days=60)

        tracks = Track.objects.filter(album__is_published=True).select_related(
            'album', 'album__artist'
        ).prefetch_related('genres', 'artists').annotate(
            recent_plays=Count(
                'plays',
                filter=Q(plays__played_at__gte=thirty_days_ago)
            ),
            previous_plays=Count(
                'plays',
                filter=Q(plays__played_at__gte=sixty_days_ago, plays__played_at__lt=thirty_days_ago)
            ),
            growth=Case(
                When(recent_plays__isnull=True, then=0),
                When(previous_plays__isnull=True, then=F('recent_plays')),
                default=F('recent_plays') - F('previous_plays'),
                output_field=IntegerField()
            )
        ).order_by('-growth')[:limit]

        serializer = self.get_serializer(tracks, many=True, context={'request': request})
        data = serializer.data
        
        cache.set(cache_key, data, timeout=60 * 15)
        
        return Response(data)

    @action(detail=False, methods=['get'], url_path='charts')
    def charts(self, request):
        limit = int(request.query_params.get('limit', 30))
        
        cache_version = cache.get('tracks:charts:version', 1)
        cache_key = f'tracks:charts:limit:{limit}:v{cache_version}'
        
        cached_data = cache.get(cache_key)
        if cached_data is not None:
            return Response(cached_data)
        
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)

        tracks = Track.objects.filter(album__is_published=True).select_related(
            'album', 'album__artist'
        ).prefetch_related('genres', 'artists').annotate(
            plays_count=Count(
                'plays',
                filter=Q(plays__played_at__gte=thirty_days_ago)
            )
        ).filter(
            plays_count__gt=0
        ).order_by('-plays_count')[:limit]

        serializer = self.get_serializer(tracks, many=True, context={'request': request})

        chart_data = []
        for index, track_data in enumerate(serializer.data, start=1):
            track_data['chart_position'] = index
            chart_data.append(track_data)

        cache.set(cache_key, chart_data, timeout=60 * 10)
        
        return Response(chart_data)