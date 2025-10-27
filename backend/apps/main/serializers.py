from rest_framework import serializers
from .models import Artist, ArtistApplication

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