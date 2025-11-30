from datetime import timedelta
from django.utils import timezone
from django.db import models
from django.conf import settings
from django.db.models import Q


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
        from apps.main.models import TrackPlay
        thirty_days_ago = timezone.now() - timedelta(days=30)
        return TrackPlay.objects.filter(
            Q(track__album__artist=self) | Q(track__artists=self),
            played_at__gte=thirty_days_ago
        ).distinct().count()

    def get_total_plays_count(self):
        from apps.main.models import TrackPlay
        return TrackPlay.objects.filter(
            Q(track__album__artist=self) | Q(track__artists=self),
        ).distinct().count()


    def get_plays_growth_30_days(self):
        from apps.main.models import TrackPlay
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


