from rest_framework import serializers
from .models import Track
from ..favorites.models import FavoriteTrack
from ..genres.models import Genre
from ..genres.serializers import GenreSerializer
from ..albums.models import Album
from ..artists.models import Artist
from ..artists.serializers import ArtistSerializer


class SimpleAlbumSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(read_only=True)

    class Meta:
        model = Album
        fields = ['id', 'title', 'artist', 'cover', 'is_published']
        read_only_fields = ['id', 'artist']


class TrackSerializer(serializers.ModelSerializer):
    album = SimpleAlbumSerializer(read_only=True)
    is_favorite = serializers.SerializerMethodField()
    genres = GenreSerializer(many=True, read_only=True)
    artists = ArtistSerializer(many=True, read_only=True)
    plays_count_30_days = serializers.SerializerMethodField()
    total_plays_count = serializers.SerializerMethodField()
    chart_position = serializers.IntegerField(read_only=True, required=False)

    class Meta:
        model = Track
        fields = ['id', 'title', 'album',
                 'duration', 'audio_file', 'is_favorite', 'genres',
                  'artists', 'plays_count_30_days', 'total_plays_count', 'chart_position',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at',
                            'album', 'duration', 'artists']

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return FavoriteTrack.objects.filter(
                user=request.user,
                track=obj
            ).exists()
        return False

    def get_plays_count_30_days(self, obj):
        return obj.get_plays_count_30_days()

    def get_total_plays_count(self, obj):
        return obj.get_total_plays_count()




class TrackCreateSerializer(serializers.ModelSerializer):
    genres = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Genre.objects.all(),
        required=True,
        allow_empty=True
    )

    artists = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Artist.objects.all(),
        required=False,
        allow_empty=True
    )

    class Meta:
        model = Track
        fields = ['title', 'duration', 'artists' ,'audio_file', 'genres']

    def validate_artists(self, value):
        if len(value) > 4:
            raise serializers.ValidationError("There can be a maximum of 6 artists on a track. ")
