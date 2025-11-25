from django.contrib import admin
from .models import Playlist, PlaylistTrack


@admin.register(Playlist)
class PlaylistAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'tracks_count', 'created_at']
    list_filter = ['created_at']
    search_fields = ['title', 'user__username']
    readonly_fields = ['created_at', 'updated_at']

    def tracks_count(self, obj):
        return obj.playlist_tracks.count()

    tracks_count.short_description = 'Tracks'


@admin.register(PlaylistTrack)
class PlaylistTrackAdmin(admin.ModelAdmin):
    list_display = ['playlist', 'track', 'order', 'added_at']
    list_filter = ['added_at']
    search_fields = ['playlist__title', 'track__title']
