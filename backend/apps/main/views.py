from django.shortcuts import render
from django.utils import timezone
from rest_framework import generics, permissions
from .models import ArtistApplication, Artist, Album, Track
from .serializers import ArtistApplicationSerializer, ArtistSerializer, AlbumSerializer


class ArtistApplicationCreateView(generics.CreateAPIView):
    serializer_class = ArtistApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]


from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

class ArtistApplicationAdminViewSet(viewsets.ModelViewSet):
    queryset = ArtistApplication.objects.all()
    serializer_class = ArtistApplicationSerializer
    permission_classes = [permissions.IsAdminUser]
    http_method_names = ['get', 'post', 'delete']

    @action(detail=True, methods=['POST'])
    def approve(self, request, pk=None):
        app = self.get_object()
        artist = app.approve()
        serializer = ArtistSerializer(artist)
        return Response(
            {
                'status': 'approved',
                'artist': serializer.data
            }
        )

    @action(detail=True, methods=['POST'])
    def reject(self, request, pk=None):
        app = self.get_object()
        app.reject()
        return Response(
            {
                'status': 'rejected',
            }
        )

