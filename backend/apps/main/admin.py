from django.contrib import admin
from .models import Artist, ArtistApplication

@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ('stage_name', 'user')

@admin.register(ArtistApplication)
class ArtistApplicationAdmin(admin.ModelAdmin):
    list_display = ('user', 'stage_name', 'status', 'created_at')



