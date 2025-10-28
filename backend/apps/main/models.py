from django.db import models
from django.conf import settings


class Artist(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE,
                             related_name='artist')
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    stage_name = models.CharField(max_length=50)
    avatar = models.ImageField(upload_to='avatars/artist', blank=True, null=True)

    def __str__(self):
        return self.stage_name

    def delete(self, *args, **kwargs):
        self.user.is_artist = False
        self.user.save()
        super().delete(*args, **kwargs)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    class Meta:
        verbose_name = 'Artist'
        verbose_name_plural = 'Artists'


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

    def __str__(self):
        return f'{self.title} ({self.artist.stage_name})'

    @property
    def track_counts(self):
        return self.tracks.count()

    class Meta:
        verbose_name = 'Album'
        verbose_name_plural = 'Albums'

class Track(models.Model):
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='tracks')
    title = models.CharField(max_length=50)
    duration = models.DurationField()
    audio_file = models.FileField(upload_to='tracks/')
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f'{self.title} - ({self.album}) - ({self.album.artist.stage_name})'

    class Meta:
        verbose_name = 'Track'
        verbose_name_plural = 'Tracks'
        ordering = ['order']
