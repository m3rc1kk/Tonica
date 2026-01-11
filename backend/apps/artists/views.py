from datetime import timedelta
from django.utils import timezone
from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from django.db.models import Q, Count, Case, When, IntegerField, F
from django.core.cache import cache
from .models import Artist, ArtistApplication
from .serializers import ArtistSerializer, ArtistApplicationSerializer


class ArtistApplicationCreateView(generics.CreateAPIView):
    serializer_class = ArtistApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

class ArtistApplicationAdminViewSet(viewsets.ModelViewSet):
    queryset = ArtistApplication.objects.all()
    serializer_class = ArtistApplicationSerializer
    permission_classes = [permissions.IsAdminUser]
    http_method_names = ['get', 'post', 'delete']


    @action(detail=True, methods=['POST'])
    def approve(self, request, pk=None):
        app = self.get_object()
        artist = app.approve()
        user = artist.user
        user.is_artist = True
        user.save()

        serializer = ArtistSerializer(artist)
        return Response(
            {
                'status': 'approved',
                'artist': serializer.data
            }
        )

    @action(detail=True, methods=['POST'])
    def reject(self, request, pk=None):
        app = self.get_object()
        app.reject()
        return Response(
            {
                'status': 'rejected',
            }
        )

class ArtistViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Artist.objects.all().order_by('id')
    serializer_class = ArtistSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ['stage_name']

    @action(detail=False, methods=['get'], url_path='trending')
    def trending(self, request):
        limit = int(request.query_params.get('limit', 4))
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        sixty_days_ago = now - timedelta(days=60)

        cache_version = cache.get('artists:trending:version', 1)
        cache_key = f'artists:trending:limit:{limit}:v{cache_version}'

        cached_data = cache.get(cache_key)
        if cached_data is not None:
            return Response(cached_data)

        artists = Artist.objects.annotate(
            recent_plays_album=Count(
                'albums__tracks__plays',
                filter=Q(albums__tracks__plays__played_at__gte=thirty_days_ago),
                distinct=True
            ),
            recent_plays_track=Count(
                'tracks__plays',
                filter=Q(tracks__plays__played_at__gte=thirty_days_ago),
                distinct=True
            ),
            previous_plays_album=Count(
                'albums__tracks__plays',
                filter=Q(
                    albums__tracks__plays__played_at__gte=sixty_days_ago,
                    albums__tracks__plays__played_at__lt=thirty_days_ago
                ),
                distinct=True
            ),
            previous_plays_track=Count(
                'tracks__plays',
                filter=Q(
                    tracks__plays__played_at__gte=sixty_days_ago,
                    tracks__plays__played_at__lt=thirty_days_ago
                ),
                distinct=True
            )
        ).annotate(
            recent_plays=F('recent_plays_album') + F('recent_plays_track'),
            previous_plays=F('previous_plays_album') + F('previous_plays_track'),
            growth=Case(
                When(recent_plays__isnull=True, then=0),
                When(previous_plays__isnull=True, then=F('recent_plays')),
                default=F('recent_plays') - F('previous_plays'),
                output_field=IntegerField()
            )
        ).order_by('-growth')[:limit]

        serializer = self.get_serializer(artists, many=True, context={'request': request})
        data = serializer.data
        
        cache.set(cache_key, data, timeout=60 * 15)
        
        return Response(data)



