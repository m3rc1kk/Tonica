from django.db import models
from django.conf import settings
from ..main.models import Artist, Album
from django.core.exceptions import ValidationError

from ..playlists.models import Playlist


class PinnedArtist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, 
                    on_delete=models.CASCADE, 
                    related_name='pinned_artists')

    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='pinned_by_artists')
    created_at = models.DateTimeField(auto_now_add=True)


    class Meta:
        unique_together = (('user', 'artist'),)
        verbose_name = 'Pinned Artist'
        verbose_name_plural = 'Pinned Artists'

    def clean(self):
        if not self.pk:
            existing_count = PinnedArtist.objects.filter(user=self.user).count()
            if existing_count >= 3:
                raise ValidationError("You can only pin up to 3 artists")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.user.username} pinned {self.artist.stage_name}"

    


class PinnedAlbum(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, 
                    on_delete=models.CASCADE,
                    related_name='pinned_albums')
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='pinned_by_albums')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (('user', 'album'),)
        verbose_name = 'Pinned Album'
        verbose_name_plural = 'Pinned Albums'

    def clean(self):
        if not self.pk:
            existing_count = PinnedAlbum.objects.filter(user=self.user).count()
            if existing_count >= 3:
                raise ValidationError("Cannot pin more than 3 albums")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.album.title}"

class PinnedPlaylist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                    on_delete=models.CASCADE,
                    related_name='pinned_playlists')
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, related_name='pinned_by_playlists')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (('user', 'playlist'),)
        verbose_name = 'Pinned Playlist'
        verbose_name_plural = 'Pinned Playlists'

    def clean(self):
        if not self.pk:
            existing_count = PinnedPlaylist.objects.filter(user=self.user).count()
            if existing_count >= 3:
                raise ValidationError("Cannot pin more than 3 playlists")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.playlist.title}"