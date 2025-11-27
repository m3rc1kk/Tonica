from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from apps.genres.models import Genre

from .models import ArtistApplication, Artist, Album, Track
from .serializers import ArtistApplicationSerializer, ArtistSerializer, AlbumSerializer, AlbumCreateSerializer, \
    TrackSerializer, TrackCreateSerializer


class ArtistApplicationCreateView(generics.CreateAPIView):
    serializer_class = ArtistApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]


from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

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


class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    permission_classes = [permissions.IsAuthenticated]

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
            if not ((self.request.user.is_artist and self.request.user.artist == obj.artist) or self.request.user.is_staff):
                raise PermissionDenied("You do not have permission to view this album.")

        if self.action in ['update', 'partial_update', 'destroy']:
            if not ((self.request.user.is_artist and self.request.user.artist == obj.artist) or self.request.user.is_staff):
                raise PermissionDenied("You do not have permission to modify this album.")

        return obj

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return AlbumCreateSerializer
        return AlbumSerializer

 




class TrackViewSet(viewsets.ModelViewSet):
    queryset = Track.objects.all()
    serializer_class = TrackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.action == 'list':
            artist_id = self.request.query_params.get('artist_id')
            genre_slug = self.request.query_params.get('genre')
            qs = super().get_queryset().select_related('album', 'album__artist').prefetch_related('genres')
            if artist_id:
                artist = get_object_or_404(Artist, pk=artist_id)
                qs = qs.filter(album__artist=artist)

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


