from rest_framework import serializers
from .models import Artist, ArtistApplication, Track, Album
from ..favorites.models import FavoriteTrack, FavoriteArtist, FavoriteAlbum
from ..genres.models import Genre
from ..genres.serializers import GenreSerializer


class ArtistSerializer(serializers.ModelSerializer):
    is_favorite = serializers.SerializerMethodField()
    plays_count_30_days = serializers.SerializerMethodField()
    total_plays_count = serializers.SerializerMethodField()

    class Meta:
        model = Artist
        fields = ['id', 'stage_name', 'avatar', 'first_name', 'last_name', 'user', 'plays_count_30_days', 'total_plays_count','is_favorite']
        read_only_fields = ['id', 'user']

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return FavoriteArtist.objects.filter(
                user=request.user,
                artist=obj
            ).exists()
        return False

    def get_plays_count_30_days(self, obj):
        return obj.get_plays_count_30_days()

    def get_total_plays_count(self, obj):
        return obj.get_total_plays_count()

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

class AlbumSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(read_only=True)
    tracks = TrackSerializer(many=True, read_only=True)
    tracks_count = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()
    plays_count_30_days = serializers.SerializerMethodField()
    total_plays_count = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = ['id', 'title', 'artist', 'tracks', 'plays_count_30_days', 'total_plays_count', 'album_type', 'cover', 'is_published', 'release_date', 'tracks_count', 'is_favorite',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_published', 'artist_name', 'tracks_count']

    def get_tracks_count(self, obj):
        return obj.tracks.count()

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return FavoriteAlbum.objects.filter(
                user=request.user,
                album=obj
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
            artists_data = track_data.pop('artists', [])
            genres_data = track_data.pop('genres', [])
            track = Track.objects.create(album=album, **track_data)
            if artists_data:
                track.artists.set(artists_data)
            if genres_data:
                track.genres.set(genres_data)

        tracks_count = album.tracks.count()
        if tracks_count > 1:
            album.album_type = 'album'
        else:
            album.album_type = 'single'

        album.save()

        return album

    def update(self, instance, validated_data):
        tracks_data = validated_data.pop('tracks', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tracks_data is not None:
            instance.tracks.all().delete()
            for track_data in tracks_data:
                artists_data = track_data.pop('artists', [])
                genres_data = track_data.pop('genres', [])
                track = Track.objects.create(album=instance, **track_data)
                if artists_data:
                    track.artists.set(artists_data)
                if genres_data:
                    track.genres.set(genres_data)

        tracks_count = instance.tracks.count()
        if tracks_count > 1:
            instance.album_type = 'album'
        else:
            instance.album_type = 'single'

        instance.save()

        return instance