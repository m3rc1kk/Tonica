# Generated migration to move data from main to albums/artists apps

from django.db import migrations


def migrate_artists_data(apps, schema_editor):
    """Migrate Artist and ArtistApplication data from main to artists app"""
    OldArtist = apps.get_model('main', 'Artist')
    NewArtist = apps.get_model('artists', 'Artist')
    OldArtistApplication = apps.get_model('main', 'ArtistApplication')
    NewArtistApplication = apps.get_model('artists', 'ArtistApplication')
    
    # Migrate Artists
    for old_artist in OldArtist.objects.all():
        NewArtist.objects.create(
            id=old_artist.id,
            user_id=old_artist.user_id,
            first_name=old_artist.first_name,
            last_name=old_artist.last_name,
            stage_name=old_artist.stage_name,
            avatar=old_artist.avatar,
        )
    
    # Migrate ArtistApplications
    for old_app in OldArtistApplication.objects.all():
        NewArtistApplication.objects.create(
            id=old_app.id,
            user_id=old_app.user_id,
            stage_name=old_app.stage_name,
            first_name=old_app.first_name,
            last_name=old_app.last_name,
            created_at=old_app.created_at,
            status=old_app.status,
        )


def migrate_albums_data(apps, schema_editor):
    """Migrate Album data from main to albums app"""
    OldAlbum = apps.get_model('main', 'Album')
    NewAlbum = apps.get_model('albums', 'Album')
    
    # Migrate Albums
    for old_album in OldAlbum.objects.all():
        NewAlbum.objects.create(
            id=old_album.id,
            artist_id=old_album.artist_id,
            title=old_album.title,
            cover=old_album.cover,
            release_date=old_album.release_date,
            album_type=old_album.album_type,
            created_at=old_album.created_at,
            updated_at=old_album.updated_at,
            is_published=old_album.is_published,
        )


def reverse_migrate_artists_data(apps, schema_editor):
    """Reverse migration - move data back from artists to main"""
    # This is for rollback, but we won't implement it fully
    # as it's complex and data might be lost
    pass


def reverse_migrate_albums_data(apps, schema_editor):
    """Reverse migration - move data back from albums to main"""
    # This is for rollback, but we won't implement it fully
    # as it's complex and data might be lost
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('artists', '0001_initial'),
        ('albums', '0001_initial'),
        ('main', '0006_alter_track_artists_trackplay'),
    ]

    operations = [
        migrations.RunPython(migrate_artists_data, reverse_migrate_artists_data),
        migrations.RunPython(migrate_albums_data, reverse_migrate_albums_data),
    ]

