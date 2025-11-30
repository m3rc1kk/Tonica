from .models import Playlist, PlaylistTrack
from rest_framework import serializers

from apps.main.serializers import TrackSerializer


class PlaylistTrackSerializer(serializers.ModelSerializer):
    track = TrackSerializer(read_only=True)

    class Meta:
        model = PlaylistTrack
        fields = ['id', 'track', 'order', 'added_at']
        read_only_fields = ['id', 'added_at']


class PlaylistSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    tracks_count = serializers.SerializerMethodField()
    playlist_tracks = PlaylistTrackSerializer(many=True, read_only=True)

    class Meta:
        model = Playlist
        fields = ['id', 'title', 'cover', 'tracks_count', 'user',
                  'playlist_tracks', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'user', 'tracks_count', 'is_favorite']

    def get_tracks_count(self, obj):
        return obj.playlist_tracks.count()

class PlaylistCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playlist
        fields = ['title', 'cover', ]

    def create(self, validated_data):
        user = self.context['request'].user
        return Playlist.objects.create(user=user, **validated_data)

class PlaylistTrackAddSerializer(serializers.Serializer):
    track_id = serializers.IntegerField()
    order = serializers.IntegerField(required=False, default=0)


