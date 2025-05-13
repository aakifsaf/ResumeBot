from rest_framework import serializers
from .models import GeneratedResume

class GeneratedResumeSerializer(serializers.ModelSerializer):
    """Serializer for the GeneratedResume model."""
    # Optionally include related data like job description title
    job_description_title = serializers.CharField(source='job_description.title', read_only=True)
    job_description_id = serializers.IntegerField(source='job_description.id', read_only=True)

    class Meta:
        model = GeneratedResume
        fields = ['id', 'job_description_id', 'job_description_title', 'generated_content', 'created_at']
        read_only_fields = ['id', 'created_at'] # User, JD are implicitly set
