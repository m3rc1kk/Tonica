from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from ..main.models import Artist, Album
from ..main.serializers import ArtistSerializer, AlbumSerializer
from .models import PinnedArtist, PinnedAlbum, PinnedPlaylist
from ..playlists.models import Playlist
from ..playlists.serializers import PlaylistSerializer



class PinnedArtistViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        pinned = PinnedArtist.objects.filter(user=request.user).select_related('artist')[:3]
        artists = [pin.artist for pin in pinned]
        serializer = ArtistSerializer(artists, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add(self, request, pk=None):
        artist = get_object_or_404(Artist, pk=pk)
        
        existing_pin = PinnedArtist.objects.filter(user=request.user).count()
        if existing_pin >= 3:
            return Response({"error": "You can only pin up to 3 artists"}, status=status.HTTP_400_BAD_REQUEST)


        if PinnedArtist.objects.filter(user=request.user, artist=artist).exists():
            return Response({"error": "Artist already pinned"}, status=status.HTTP_200_OK)
        
        pinned = PinnedArtist.objects.create(user=request.user, artist=artist)
        return Response(
            {'status': 'pinned'},
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['delete'])
    def remove(self, request, pk=None):
        artist = get_object_or_404(Artist, pk=pk)
        PinnedArtist.objects.filter(user=request.user, artist=artist).delete()
        return Response(
            {'status': 'unpinned'},
            status=status.HTTP_200_OK
        )



class PinnedAlbumViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        pinned = PinnedAlbum.objects.filter(
            user=request.user
        ).select_related(
            'album',
            'album__artist'
        ).prefetch_related(
            'album__tracks'
        )[:3]
        albums = [pin.album for pin in pinned]
        serializer = AlbumSerializer(albums, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add(self, request, pk=None):
        album = get_object_or_404(Album, pk=pk)
        
        existing_count = PinnedAlbum.objects.filter(user=request.user).count()
        if existing_count >= 3:
            return Response(
                {'error': 'Cannot pin more than 3 albums'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if PinnedAlbum.objects.filter(user=request.user, album=album).exists():
            return Response(
                {'status': 'already_pinned'},
                status=status.HTTP_200_OK
            )
        
        pinned = PinnedAlbum.objects.create(
            user=request.user,
            album=album,
        )
        return Response(
            {'status': 'pinned'},
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['delete'])
    def remove(self, request, pk=None):
        album = get_object_or_404(Album, pk=pk)
        PinnedAlbum.objects.filter(
            user=request.user,
            album=album
        ).delete()
        return Response(
            {'status': 'unpinned'},
            status=status.HTTP_200_OK
        )


class PinnedPlaylistViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        pinned = PinnedPlaylist.objects.filter(
            user=request.user
        ).select_related(
            'playlist',
            'playlist__user'
        ).prefetch_related(
            'playlist__playlist_tracks',
            'playlist__playlist_tracks__track'
        )[:3]
        playlists = [pin.playlist for pin in pinned]
        serializer = PlaylistSerializer(playlists, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add(self, request, pk=None):
        playlist = get_object_or_404(Playlist, pk=pk)

        if playlist.user != request.user:
            return Response(
                {'error': 'You can only pin your own playlists'},
                status=status.HTTP_403_FORBIDDEN
            )

        existing_count = PinnedPlaylist.objects.filter(user=request.user).count()
        if existing_count >= 3:
            return Response(
                {'error': 'Cannot pin more than 3 playlists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if PinnedPlaylist.objects.filter(user=request.user, playlist=playlist).exists():
            return Response(
                {'status': 'already_pinned'},
                status=status.HTTP_200_OK
            )

        pinned = PinnedPlaylist.objects.create(
            user=request.user,
            playlist=playlist,
        )
        return Response(
            {'status': 'pinned'},
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['delete'])
    def remove(self, request, pk=None):
        playlist = get_object_or_404(Playlist, pk=pk)
        PinnedPlaylist.objects.filter(
            user=request.user,
            playlist=playlist
        ).delete()
        return Response(
            {'status': 'unpinned'},
            status=status.HTTP_200_OK
        )