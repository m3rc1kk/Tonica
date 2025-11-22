from rest_framework import serializers
from .models import Artist, ArtistApplication, Track, Album
from ..favorites.models import FavoriteTrack, FavoriteArtist, FavoriteAlbum


class ArtistSerializer(serializers.ModelSerializer):
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Artist
        fields = ['id', 'stage_name', 'avatar', 'first_name', 'last_name', 'user', 'is_favorite']
        read_only_fields = ['id', 'user']


    def get_is_favorite(self, obj):
        request = self.context['request']
        if request and request.user.is_authenticated:
            return FavoriteArtist.objects.filter(
                user=request.user,
                artist=obj
            ).exists()
        return False

class ArtistApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtistApplication
        fields = ['id', 'stage_name', 'first_name', 'last_name', 'status', 'created_at', 'user']
        read_only_fields = ['id', 'created_at', 'status', 'user']

    def create(self, validated_data):
        user = self.context['request'].user
        if hasattr(user, 'artist_application'):
            raise serializers.ValidationError(
                'You have already submitted your application.'
            )
        if user.is_artist:
            raise serializers.ValidationError(
                'You are already an artist.'
            )

        return ArtistApplication.objects.create(user=user, **validated_data)


class SimpleAlbumSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(read_only=True)

    class Meta:
        model = Album
        fields = ['id', 'title', 'artist', 'cover', 'is_published']
        read_only_fields = ['id', 'artist']

class TrackSerializer(serializers.ModelSerializer):
    album = SimpleAlbumSerializer(read_only=True)
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Track
        fields = ['id', 'title', 'album',
                 'duration', 'audio_file', 'is_favorite',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at',
                            'album', 'duration']

    def get_is_favorite(self, obj):
        request = self.context['request']
        if request and request.user.is_authenticated:
            return FavoriteTrack.objects.filter(
                user=request.user,
                track=obj
            ).exists()
        return False

class AlbumSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(read_only=True)
    tracks = TrackSerializer(many=True, read_only=True)
    tracks_count = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = ['id', 'title', 'artist', 'tracks', 'album_type', 'cover', 'is_published', 'release_date', 'tracks_count', 'is_favorite',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_published', 'artist_name', 'tracks_count']

    def get_tracks_count(self, obj):
        return obj.tracks.count()

    def get_is_favorite(self, obj):
        request = self.context['request']
        if request and request.user.is_authenticated:
            return FavoriteAlbum.objects.filter(
                user=request.user,
                album=obj
            ).exists()
        return False

class TrackCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ['title', 'duration', 'audio_file']

class AlbumCreateSerializer(serializers.ModelSerializer):
    tracks = TrackCreateSerializer(many=True)

    class Meta:
        model = Album
        fields = ['title', 'album_type', 'cover', 'release_date', 'tracks']

    def create(self, validated_data):
        user = self.context['request'].user
        if not user.is_artist:
            raise serializers.ValidationError(
                f'You are not an artist.'
            )

        tracks_data = validated_data.pop('tracks', [])

        album = Album.objects.create(artist=user.artist, **validated_data)

        for track_data in tracks_data:
            Track.objects.create(album=album, **track_data)

        return album