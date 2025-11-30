from datetime import timedelta
from django.utils import timezone
from django.db import models

from apps.artists.models import Artist


class AlbumManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().select_related('artist').prefetch_related('tracks')

    def published(self):
        return self.get_queryset().filter(is_published=True)

    def by_artist(self, artist):
        return self.get_queryset().filter(artist=artist)

    def for_artist_profile(self, artist, user=None):
        qs = self.by_artist(artist)
        if user and user.is_artist and user.artist == artist:
            return qs
        return qs.filter(is_published=True)




class Album(models.Model):
    ALBUM_TYPE_CHOICES = [
        ('album', 'Album'),
        ('single', 'Single'),
    ]

    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='albums')
    title = models.CharField(max_length=50)
    cover = models.ImageField(upload_to='albums/', blank=True, null=True)
    release_date = models.DateField()
    album_type = models.CharField(max_length=20, choices=ALBUM_TYPE_CHOICES, default='single')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=False)

    objects = AlbumManager()

    class Meta:
        verbose_name = 'Album'
        verbose_name_plural = 'Albums'

    def __str__(self):
        return f'{self.title} ({self.artist.stage_name})'

    def get_plays_count_30_days(self):
        from apps.main.models import TrackPlay
        thirty_days_ago = timezone.now() - timedelta(days=30)
        return TrackPlay.objects.filter(
            track__album=self,
            played_at__gte=thirty_days_ago,
        ).count()

    def get_total_plays_count(self):
        from apps.main.models import TrackPlay
        return TrackPlay.objects.filter(
            track__album=self,
        ).count()

    def get_plays_growth_30_days(self):
        from apps.main.models import TrackPlay
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        sixty_days_ago = now - timedelta(days=60)

        recent_plays = TrackPlay.objects.filter(
            track__album=self,
            played_at__gte=thirty_days_ago,
        ).count()

        previous_plays = TrackPlay.objects.filter(
            track__album=self,
            played_at__gte=sixty_days_ago,
            played_at__lt=thirty_days_ago,
        )

        return recent_plays - previous_plays

