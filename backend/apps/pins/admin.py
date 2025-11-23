from django.contrib import admin
from .models import PinnedArtist, PinnedAlbum


@admin.register(PinnedArtist)
class PinnedArtistAdmin(admin.ModelAdmin):
    list_display = ['user', 'artist', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'artist__stage_name']


@admin.register(PinnedAlbum)
class PinnedAlbumAdmin(admin.ModelAdmin):
    list_display = ['user', 'album', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'album__title']