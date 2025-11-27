from django.core.management.base import BaseCommand
from ...models import Genre

class Command(BaseCommand):
    help = 'Basic set of genres'

    def handle(self, *args, **options):
        genres = [
            'Pop', 'Rock', 'Hip-Hop', 'Rap', 'Electronic', 'Jazz',
            'Classical', 'Country', 'R&B', 'Soul', 'Reggae', 'Latin',
            'Metal', 'Folk', 'Blues', 'Indie', 'Punk', 'Alternative',
            'Dance', 'House', 'Techno', 'Ambient', 'Soundtrack',
            'World Music', 'Funk', 'Disco', 'Gospel', 'New Age',
            'Ska', 'Dubstep', 'Trance', 'Drum & Bass', 'Hardcore',
            'Progressive Rock', 'Psychedelic', 'Grunge', 'Post-Rock'
        ]

        created_count = 0
        for genre_name in genres:
            genre, created = Genre.objects.get_or_create(title=genre_name)
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'Created genre {genre_name}'))

            else:
                self.stdout.write(
                    self.style.WARNING(f'Genre {genre_name} already exists')
                )

        self.stdout.write(self.style.SUCCESS('Successfully created genre'))