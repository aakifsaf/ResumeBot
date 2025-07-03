from rest_framework import serializers
from .models import ResumeTemplate, Resume

class ResumeTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeTemplate
        fields = '__all__'

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'

class ManualResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = [
            'id', 'user', 'template', 'title', 'status', 'resume_file', 
            'created_at', 'updated_at', 'work_experiences', 'education', 
            'projects', 'certifications', 'languages', 'skills', 'personal_info'
        ]