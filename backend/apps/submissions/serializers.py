from rest_framework import serializers
from apps.artists.models import Artist
from apps.genres.models import Genre
from .models import AlbumSubmission, TrackSubmission, CollaboratorSubmission, CollaborationRequest


class TrackSubmissionSerializer(serializers.ModelSerializer):
    genres = serializers.StringRelatedField(
        many=True,
        queryset=Genre.objects.all(),
        slug_field='slug',
        required=False
    )

    class Meta:
        model = TrackSubmission
        fields = ['id', 'title', 'duration', 'audio_file', 'genres']
        read_only_fields = ['id']

class TrackSubmissionCreateSerializer(serializers.ModelSerializer):
    genres = serializers.SlugRelatedField(
        many=True,
        queryset=Genre.objects.all(),
        slug_field='slug',
        required=False
    )

    class Meta:
        model = TrackSubmission
        fields = ['title', 'duration', 'audio_file', 'genres', 'order']


class AlbumSubmissionSerializer(serializers.ModelSerializer):
    track_submissions = TrackSubmissionSerializer(many=True, read_only=True)
    artist = serializers.StringRelatedField(read_only=True)
    status = serializers.CharField(read_only=True)

    class Meta:
        model = AlbumSubmission
        fields = [
            'id', 'artist', 'title', 'cover', 'release_date',
            'status', 'track_submissions', 'created_at', 'updated_at',
            'submitted_at', 'reviewed_at', 'rejection_reason'
        ]
        read_only_fields = [
            'id', 'artist', 'status', 'created_at', 'updated_at',
            'submitted_at', 'reviewed_at', 'rejection_reason'
        ]

class AlbumSubmissionCreateSerializer(serializers.ModelSerializer):
    track_submissions = TrackSubmissionCreateSerializer(many=True, required=False)
    cover = serializers.ImageField(required=False)

    class Meta:
        model = AlbumSubmission
        fields = ['title', 'cover', 'release_date', 'track_submissions']


    def create(self, validated_data):
        track_submissions_data = validated_data.pop('track_submissions', [])
        artist = self.context['request'].user.artist

        submission = AlbumSubmission.objects.create(
            artist=artist,
            **validated_data
        )

        for idx, track_data in enumerate(track_submissions_data):
            genres_data = track_data.pop('genres', [])
            track_submission = TrackSubmission.objects.create(
                submission=submission,
                **track_data
            )
            track_submission.genres.add(genres_data)

        return submission


    def update(self, instance, validated_data):
        if instance.status != 'draft':
            raise serializers.ValidationError('Can only edit draft submissions')

        track_submissions_data = validated_data.pop('track_submissions', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if track_submissions_data is not None:
            instance.track_submissions.all().delete()

            for idx, track_data in enumerate(track_submissions_data):
                genres_data = track_data.pop('genres', [])
                track_submission = TrackSubmission.objects.create(
                    submission=instance,
                    **track_data
                )
                track_submission.genres.set(genres_data)

        return instance

class CollaborationRequestSerializer(serializers.ModelSerializer):
    requested_artist = serializers.StringRelatedField(read_only=True)
    requesting_artist = serializers.StringRelatedField(read_only=True)
    track_submission = serializers.StringRelatedField(read_only=True)
    status = serializers.CharField(read_only=True)

    class Meta:
        model = CollaborationRequest
        fields = [
            'id', 'track_submission', 'requested_artist', 'requesting_artist',
            'status', 'message', 'created_at', 'responded_at'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'responded_at']


class CollaborationRequestCreateSerializer(serializers.ModelSerializer):
    track_submission_id = serializers.IntegerField()
    requested_artist_id = serializers.IntegerField()
    message = serializers.CharField(required=False, allow_blank=True)

    def validate_requested_artist_id(self, value):
        artist = Artist.objects.filter(id=value).first()
        if not artist:
            raise serializers.ValidationError('Artist does not exist')
        return value

    def validate_track_submission_id(self, value):
        track_submission = TrackSubmission.objects.filter(id=value).first()
        if not track_submission:
            raise serializers.ValidationError('Track submission does not exist')

        user = self.context['request'].user
        if track_submission.submission.artist != user.artist:
            raise serializers.ValidationError('You can only request collaboration for your own tracks')

        return value


    def create(self, validated_data):
        user = self.context['request'].user
        track_submission = TrackSubmission.objects.get(id=validated_data['track_submission_id'])
        requested_artist = Artist.objects.get(id=validated_data['requested_artist_id'])

        if requested_artist == user.artist:
            raise serializers.ValidationError('Cannot request collaboration from yourself')

        if CollaborationRequest.objects.filter(
            track_submission=track_submission,
            requested_artist=requested_artist,
            status='pending'
        ).exists():
            raise serializers.ValidationError('Collaboration request already exists')

        collaboration_request = CollaborationRequest.objects.create(
            track_submission=track_submission,
            requested_artist=requested_artist,
            requesting_artist=user.artist,
            message=validated_data.get('message', '')
        )

        return collaboration_request