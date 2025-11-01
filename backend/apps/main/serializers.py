from rest_framework import serializers
from .models import Artist, ArtistApplication, Track, Album

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = ['id', 'stage_name', 'avatar', 'first_name', 'last_name', 'user']
        read_only_fields = ['id', 'user']

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


class TrackSerializer(serializers.ModelSerializer):
    album_name = serializers.CharField(source='album.title', read_only=True)
    album_cover = serializers.ImageField(source='album.cover', read_only=True)
    artist_name = serializers.CharField(source='album.artist', read_only=True)

    class Meta:
        model = Track
        fields = ['id', 'title', 'album',
                  'album_name', 'duration', 'audio_file', 'album_cover', 'artist_name',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at',
                            'album', 'album_name', 'duration']

class AlbumSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(read_only=True)
    tracks = TrackSerializer(many=True, read_only=True)
    artist_name = serializers.CharField(source='artist.stage_name', read_only=True)

    class Meta:
        model = Album
        fields = ['id', 'title', 'artist', 'artist_name', 'tracks', 'album_type', 'cover', 'is_published', 'release_date',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_published', 'artist_name', 'tracks_count']

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