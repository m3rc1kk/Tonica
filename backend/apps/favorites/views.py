from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from ..favorites.models import FavoriteTrack, FavoriteAlbum, FavoriteArtist
from apps.main.models import Track
from apps.main.serializers import TrackSerializer
from apps.albums.models import Album
from apps.albums.serializers import AlbumSerializer
from apps.artists.models import Artist
from apps.artists.serializers import ArtistSerializer


class FavoriteTrackViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        limit = request.query_params.get('limit')
        favorites = FavoriteTrack.objects.filter(
            user=request.user
        ).select_related(
            'track',
            'track__album',
            'track__album__artist'
        )

        if limit:
            try:
                limit = int(limit)
                favorites = favorites[:limit]
            except ValueError:
                pass

        tracks = [fav.track for fav in favorites]
        serializer = TrackSerializer(tracks, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add(self, request, pk=None):
        track = get_object_or_404(Track, pk=pk)
        favorite, created = FavoriteTrack.objects.get_or_create(
            user=request.user,
            track=track
        )
        if created:
            return Response(
                {'status': 'added'},
                status=status.HTTP_201_CREATED
            )
        return Response(
            {'status': 'already_in_favorites'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['delete'])
    def remove(self, request, pk=None):
        track = get_object_or_404(Track, pk=pk)
        FavoriteTrack.objects.filter(
            user=request.user,
            track=track
        ).delete()
        return Response(
            {'status': 'removed'},
            status=status.HTTP_200_OK
        )


class FavoriteAlbumViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        limit = request.query_params.get('limit')
        favorites = FavoriteAlbum.objects.filter(
            user=request.user
        ).select_related(
            'album',
            'album__artist'
        ).prefetch_related(
            'album__tracks',
            'album__tracks__album__artist'
        )

        if limit:
            try:
                limit = int(limit)
                favorites = favorites[:limit]
            except ValueError:
                pass

        albums = [fav.album for fav in favorites]
        serializer = AlbumSerializer(albums, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add(self, request, pk=None):
        album = get_object_or_404(Album, pk=pk)
        favorite, created = FavoriteAlbum.objects.get_or_create(
            user=request.user,
            album=album
        )
        if created:
            return Response(
                {'status': 'added'},
                status=status.HTTP_201_CREATED
            )
        return Response(
            {'status': 'already_in_favorites'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['delete'])
    def remove(self, request, pk=None):
        album = get_object_or_404(Album, pk=pk)
        FavoriteAlbum.objects.filter(
            user=request.user,
            album=album
        ).delete()
        return Response(
            {'status': 'removed'},
            status=status.HTTP_200_OK
        )


class FavoriteArtistViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        limit = request.query_params.get('limit')
        favorites = FavoriteArtist.objects.filter(
            user=request.user
        ).select_related('artist')

        if limit:
            try:
                limit = int(limit)
                favorites = favorites[:limit]
            except ValueError:
                pass

        artists = [fav.artist for fav in favorites]
        serializer = ArtistSerializer(artists, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add(self, request, pk=None):
        artist = get_object_or_404(Artist, pk=pk)
        favorite, created = FavoriteArtist.objects.get_or_create(
            user=request.user,
            artist=artist
        )
        if created:
            return Response(
                {'status': 'added'},
                status=status.HTTP_201_CREATED
            )
        return Response(
            {'status': 'already_in_favorites'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['delete'])
    def remove(self, request, pk=None):
        artist = get_object_or_404(Artist, pk=pk)
        FavoriteArtist.objects.filter(
            user=request.user,
            artist=artist
        ).delete()
        return Response(
            {'status': 'removed'},
            status=status.HTTP_200_OK
        )
