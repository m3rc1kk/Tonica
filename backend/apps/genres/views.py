from django.db.models import Count
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.genres.models import Genre
from apps.genres.serializers import GenreSerializer


class GenreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    lookup_field = 'slug'

    @action(detail=False, methods=['get'])
    def popular(self, request):
        limit = int(request.query_params.get('limit', 5))
        genres = Genre.objects.annotate(
            tracks_count=Count('tracks')
        ).filter(tracks_count__gt=0).order_by('-tracks_count')[:limit]
        serializer = self.get_serializer(genres, many=True)
        return Response(serializer.data)

