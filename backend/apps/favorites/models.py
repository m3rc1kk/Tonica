from django.conf import settings
from django.db import models

from ..main.models import Track, Album, Artist


class FavoriteTrack(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorite_tracks')
    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name='favorited_by_tracks')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (('user', 'track'),)
        verbose_name = 'Favorite Track'
        verbose_name_plural = 'Favorite Tracks'


class FavoriteAlbum(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorite_albums')
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='favorited_by_albums')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (('user', 'album'),)
        verbose_name = 'Favorite Album'
        verbose_name_plural = 'Favorite Albums'

class FavoriteArtist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorite_artists')
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='favorited_by_artists')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (('user', 'artist'),)
        verbose_name = 'Favorite Artist'
        verbose_name_plural = 'Favorite Artists'
