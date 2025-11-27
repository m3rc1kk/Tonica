from django.contrib import admin
from .models import Artist, ArtistApplication, Album, Track

@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ('id', 'stage_name', 'user')

@admin.register(ArtistApplication)
class ArtistApplicationAdmin(admin.ModelAdmin):
    list_display = ('id','user', 'stage_name', 'status', 'created_at')


@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'artist')

@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = ['title', 'album', 'duration', 'genres_display']
    list_filter = ['genres', 'created_at']
    filter_horizontal = ['genres']
    search_fields = ['title', 'album__title']

    def genres_display(self, obj):
        return ', '.join([g.title for g in obj.genres.all()])
    genres_display.short_description = 'Genres'