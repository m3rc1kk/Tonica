from rest_framework import serializers
from .models import Artist, ArtistApplication
from ..favorites.models import FavoriteArtist


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
