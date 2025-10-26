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

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()


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
        return {f'Application from {self.user.username} - ({self.get_status_display()})'}

    def approve(self):
        if self.status != 'approved' and self.status != 'rejected':
            Artist.objects.create(user=self.user,
                                  stage_name=self.stage_name,
                                  first_name=self.first_name,
                                  last_name=self.last_name,
                                  )
            self.user.is_artist = True
            self.user.save()
            self.status = 'approved'
            self.save()
