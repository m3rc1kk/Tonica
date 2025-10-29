from django.contrib import admin
from .models import Artist, ArtistApplication, Album, Track

@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ('id', 'stage_name', 'user')

@admin.register(ArtistApplication)
class ArtistApplicationAdmin(admin.ModelAdmin):
    list_display = ('user', 'stage_name', 'status', 'created_at')


@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'artist')

@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = ('id','title', 'album')