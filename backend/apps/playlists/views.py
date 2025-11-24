from django.shortcuts import render, get_object_or_404
from django.db.models import Max
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from .models import Playlist, PlaylistTrack
from .serializers import PlaylistTrackAddSerializer
from ..main.models import Track


class PlaylistViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Playlist.objects.filter(user=self.request.user)

    def get_object(self):
        obj = super().get_object()
        if obj.user != self.request.user:
            raise PermissionDenied('You can only access your own playlists')
        return obj

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.user != self.request.user:
            raise PermissionDenied('You can only edit your own playlists')
        serializer.save()

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied('You can only delete your own playlists')
        instance.delete()


    @action(detail=True, methods=['post'])
    def add_track(self, request, pk=None):
        playlist = self.get_object()
        serializer = PlaylistTrackAddSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        track_id = serializer.validated_data['track_id']
        order = serializer.validated_data.get('order', 0)

        track = get_object_or_404(Track, pk=track_id)

        if PlaylistTrack.objects.filter(playlist=playlist, track=track).exists():
            return Response({'error': 'Track already exists'}, status=status.HTTP_400_BAD_REQUEST)

        if order == 0:
            max_order = PlaylistTrack.object.filter(playlist=playlist).aggregate(Max('order'))['order__max'] or 0
            order = max_order + 1

        PlaylistTrack.objects.create(playlist=playlist, track=track, order=order)

        return Response({'status': 'Track added'}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'])
    def remove_track(self, request, pk=None):
        playlist = self.get_object()
        track_id = request.query_params.get('track_id')
        if not track_id:
            return Response({'error': 'Track id is required'}, status=status.HTTP_400_BAD_REQUEST)

        track = get_object_or_404(Track, pk=track_id)
        PlaylistTrack.objects.filter(playlist=playlist, track=track).delete()
        return Response({'status': 'Track removed'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def reorder_track(self, request, pk=None):
        playlist = self.get_object()
        track_orders = request.data.get('track_orders', [])

        for item in track_orders:
            track_id = item.get('track_id')
            order = item.get('order')

            PlaylistTrack.objects.filter(playlist=playlist, track=track_id).update(order=order)

        return Response({'status': 'Track reordered'}, status=status.HTTP_200_OK)

