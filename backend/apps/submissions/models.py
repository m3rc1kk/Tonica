from django.db import models
from django.conf import settings
from django.utils import timezone
from apps.artists.models import Artist
from apps.genres.models import Genre

class AlbumSubmission(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    artist = models.ForeignKey(
        Artist,
        on_delete=models.CASCADE,
        related_name='album_submissions',
    )

    title = models.CharField(max_length=50)
    cover = models.ImageField(upload_to='submissions/albums/', blank=True, null=True)
    release_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_submissions',
    )
    rejected_reason = models.TextField(blank=True)

    album = models.OneToOneField(
        'albums.Album',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='submission',
    )

    class Meta:
        verbose_name = 'Album Submission'
        verbose_name_plural = 'Album Submissions'
        ordering = ('-created_at',)


    def __str__(self):
        return f'{self.title} by {self.artist.stage_name} - {self.get_status_display()}'

    def submit_for_review(self):
        if self.status == 'draft':
            self.status = 'pending'
            self.submitted_at = timezone.now()
            self.save()
            return True
        return False

    def approve(self, reviewer):
        if self.status == 'pending':
            from apps.albums.models import Album
            from apps.main.models import Track

            album = Album.objects.create(
                artist=self.artist,
                title=self.title,
                cover=self.cover,
                release_date=self.release_date,
                is_published = False,
                album_type='single' if self.track_submissions.count() == 1 else 'album',
            )

            for track_submission in self.track_submissions.all():
                track = Track.objects.create(
                    album=album,
                    title=track_submission.title,
                    duration=track_submission.duration,
                    audio_file=track_submission.audio_file,
                )

                track.genres.set(track_submission.genres.all())

            self.album = album
            self.status = 'approved'
            self.reviewed_at = timezone.now()
            self.reviewer = reviewer
            self.save()

            return album
        return None

    def reject(self, reviewer, reason=''):
        if self.status == 'pending':
            self.status = 'rejected'
            self.reviewed_at = timezone.now()
            self.reviewer = reviewer
            self.rejection_reason = reason
            self.save()
            return True
        return False

class TrackSubmission(models.Model):
    submission = models.ForeignKey(
        AlbumSubmission,
        on_delete=models.CASCADE,
        related_name='track_submissions',
    )
    title = models.CharField(max_length=50)
    duration = models.DurationField()
    audio_file = models.ImageField(upload_to='submissions/tracks/')
    genres = models.ManyToManyField(Genre, related_name='track_submissions', blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Track Submission'
        verbose_name_plural = 'Track Submissions'
        ordering = ['created_at']

    def __str__(self):
        return f'{self.title} by {self.submission.artist} - {self.submission.title}'



class CollaborationRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('canceled', 'Canceled'),
    )

    track_submission = models.ForeignKey(
        TrackSubmission,
        on_delete=models.CASCADE,
        related_name='collaboration_requests',
    )
    requested_artist = models.ForeignKey(
        Artist,
        on_delete=models.CASCADE,
        related_name='collaboration_requests',
    )
    requesting_artist = models.ForeignKey(
        Artist,
        on_delete=models.CASCADE,
        related_name='sent_collaboration_requests',
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Collaboration Request'
        verbose_name_plural = 'Collaboration Requests'
        unique_together = ['track_submission', 'requested_artist']
        ordering = ('-created_at',)


    def __str__(self):
        return f'{self.requesting_artist.stage_name} -> {self.requested_artist.stage_name} ({self.track_submission.title})'


    def accept(self):
        if self.status == 'pending':
            self.status = 'accepted'
            self.responded_at = timezone.now()
            self.save()
            return True
        return False

    def reject(self):
        if self.status == 'pending':
            self.status = 'rejected'
            self.responded_at = timezone.now()
            self.save()
            return True
        return False

    def cancel(self):
        if self.status == 'pending':
            self.status = 'cancelled'
            self.save()
            return True
        return False
