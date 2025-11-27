from django.contrib import admin

from django.contrib import admin
from .models import Genre


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'tracks_count', 'created_at']
    search_fields = ['title', 'slug']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at']

    def tracks_count(self, obj):
        return obj.tracks.count()
    tracks_count.short_description = 'Tracks Count'
