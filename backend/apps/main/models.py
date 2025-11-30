from datetime import timedelta
from django.utils import timezone
from django.db import models
from django.conf import settings
from django.db.models import Count
from django.db.models import Q

from apps.genres.models import Genre


class Artist(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE,
                             related_name='artist')
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    stage_name = models.CharField(max_length=50)
    avatar = models.ImageField(upload_to='avatars/artist', blank=True, null=True)

    class Meta:
        verbose_name = 'Artist'
        verbose_name_plural = 'Artists'

    def __str__(self):
        return self.stage_name

    def delete(self, *args, **kwargs):
        self.user.is_artist = False
        self.user.save()
        super().delete(*args, **kwargs)

    def get_plays_count_30_days(self):
        thirty_days_ago = timezone.now() - timedelta(days=30)
        return TrackPlay.objects.filter(
            Q(track__album__artist=self) | Q(track__artists=self),
            played_at__gte=thirty_days_ago
        ).distinct().count()

    def get_total_plays_count(self):
        return TrackPlay.objects.filter(
            Q(track__album__artist=self) | Q(track__artists=self),
        ).distinct().count()


    def get_plays_growth_30_days(self):
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        sixty_days_ago = now - timedelta(days=60)

        recent_plays = TrackPlay.objects.filter(
            (Q(track__album__artist=self) | Q(track__artists=self)),
            played_at__gte=thirty_days_ago,
        ).distinct().count()

        previous_plays = TrackPlay.objects.filter(
            (Q(track__album__artist=self) | Q(track__artists=self)),
            played_at__gte=sixty_days_ago,
            played_at__lt=thirty_days_ago,
        )

        return recent_plays - previous_plays


class ArtistApplication(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    user = models.OneToOneField(settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE,
                                related_name='artist_application')
    stage_name = models.CharField(max_length=50)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f'Application from {self.user.username} - ({self.get_status_display()})'

    class Meta:
        verbose_name = 'Artist Application'
        verbose_name_plural = 'Artist Applications'

    def approve(self):
        if self.status != 'approved':
            if hasattr(self.user, 'artist'):
                self.user.is_artist = True
                self.status = 'approved'
                self.save()
                return self.user.artist

            artist = Artist.objects.create(user=self.user,
                                  stage_name=self.stage_name,
                                  first_name=self.first_name,
                                  last_name=self.last_name,
                                  )
            self.user.is_artist = True
            self.status = 'approved'
            self.save()

            return artist

    def reject(self):
        if hasattr(self.user, 'artist'):
            artist =self.user.artist
            artist.delete()
        self.status = 'rejected'
        self.save()



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
        thirty_days_ago = timezone.now() - timedelta(days=30)
        return TrackPlay.objects.filter(
            track__album=self,
            played_at__gte=thirty_days_ago,
        ).count()

    def get_total_plays_count(self):
        return TrackPlay.objects.filter(
            track__album=self,
        ).count()

    def get_plays_growth_30_days(self):
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

