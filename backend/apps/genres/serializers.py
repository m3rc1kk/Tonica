from rest_framework import serializers
from .models import Genre

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'title', 'slug']
        read_only_fields = ['id', 'slug']


