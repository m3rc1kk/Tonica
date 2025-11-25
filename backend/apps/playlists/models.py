from django.db import models
from django.conf import settings

from apps.main.models import Track


class Playlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE,
                             related_name='playlists')
    title = models.CharField(max_length=100)
    cover = models.ImageField(upload_to='playlists/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'playlist'
        verbose_name_plural = 'playlists'
        ordering = ('-created_at',)

    def __str__(self):
        return f'{self.title} ({self.user.username})'


class PlaylistTrack(models.Model):
    playlist = models.ForeignKey(Playlist,
                                 on_delete=models.CASCADE,
                                 related_name='playlist_tracks')
    track = models.ForeignKey(Track,
                              on_delete=models.CASCADE,
                              related_name='in_playlists')
    order = models.PositiveIntegerField(default=0)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (('playlist', 'track'),)
        ordering = ['order', 'added_at']
        verbose_name = 'Playlist Track'
        verbose_name_plural = 'Playlist Tracks'

    def __str__(self):
        return f'{self.playlist.title} ({self.track.title})'


