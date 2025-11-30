from datetime import timedelta
from django.utils import timezone
from django.db import models
from django.conf import settings
from django.db.models import Count
from django.db.models import Q

from apps.genres.models import Genre
from apps.albums.models import Album
from apps.artists.models import Artist


class Track(models.Model):
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='tracks')
    title = models.CharField(max_length=50)
    duration = models.DurationField()
    artists = models.ManyToManyField(Artist, related_name='tracks', blank=True)
    genres = models.ManyToManyField(Genre, related_name='tracks', blank=True)
    audio_file = models.FileField(upload_to='tracks/', null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Track'
        verbose_name_plural = 'Tracks'

    def __str__(self):
        return f'{self.title} - ({self.album}) - ({self.album.artist.stage_name})'

    def get_artists(self):
        track_artists = self.artists.all()
        if track_artists.exists():
            return track_artists
        return [self.album.artist]

    def get_plays_count_30_days(self):
        thirty_days_ago = timezone.now() - timedelta(days=30)
        return self.plays.filter(played_at__gte=thirty_days_ago).count()

    def get_total_plays_count(self):
        return self.plays.count()

    def get_plays_growth_30_days(self):
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        sixty_days_ago = now - timedelta(days=60)

        recent_plays = self.plays.filter(
            played_at__gte=thirty_days_ago,
        ).count()

        previous_plays = self.plays.filter(
            played_at__gte=sixty_days_ago,
            played_at__lt=thirty_days_ago,
        )

        return recent_plays - previous_plays

class TrackPlay(models.Model):
    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name='plays')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='track_plays'
    )

    played_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Track Play'
        verbose_name_plural = 'Track Plays'
        indexes = [
            models.Index(fields=['played_at']),
            models.Index(fields=['track', 'played_at' ]),
        ]

    def __str__(self):
        return f'{self.track.title} - {self.user.username} - {self.played_at}'

