import re
from rest_framework import serializers
from django.core.validators import EmailValidator, RegexValidator
from .models import Resume, ResumeTemplate, WorkExperience, Education, Skill

class WorkExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkExperience
        fields = ['id', 'company', 'position', 'start_date', 'end_date', 'is_current', 'description']

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'institution', 'degree', 'field_of_study', 'start_date', 'end_date', 'is_current', 'gpa']

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'proficiency']

class ResumeTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeTemplate
        fields = ['id', 'name', 'category', 'description', 'primary_color', 'secondary_color']

class ResumeSerializer(serializers.ModelSerializer):
    work_experiences = WorkExperienceSerializer(many=True, read_only=True)
    education = EducationSerializer(many=True, read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    template = ResumeTemplateSerializer(read_only=True)

    # Custom validators
    first_name = serializers.CharField(
        max_length=50, 
        min_length=2,
        error_messages={
            'min_length': 'First name must be at least 2 characters long.',
            'max_length': 'First name cannot exceed 50 characters.'
        }
    )
    last_name = serializers.CharField(
        max_length=50, 
        min_length=2,
        error_messages={
            'min_length': 'Last name must be at least 2 characters long.',
            'max_length': 'Last name cannot exceed 50 characters.'
        }
    )
    email = serializers.EmailField(
        validators=[EmailValidator()],
        error_messages={
            'invalid': 'Enter a valid email address.'
        }
    )
    phone = serializers.CharField(
        validators=[RegexValidator(
            regex=r'^\+?1?\d{9,15}$', 
            message='Enter a valid phone number.'
        )],
        required=False,
        allow_blank=True
    )
    location = serializers.CharField(
        max_length=100, 
        min_length=2,
        error_messages={
            'min_length': 'Location must be at least 2 characters long.',
            'max_length': 'Location cannot exceed 100 characters.'
        }
    )
    summary = serializers.CharField(
        max_length=500, 
        required=False,
        allow_blank=True,
        error_messages={
            'max_length': 'Summary cannot exceed 500 characters.'
        }
    )

    class Meta:
        model = Resume
        fields = [
            'id', 'user', 'template', 'title', 'status', 
            'first_name', 'last_name', 'email', 'phone', 'location', 
            'summary', 'created_at', 'updated_at', 
            'work_experiences', 'education', 'skills'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def validate(self, data):
        # Additional cross-field validations
        if not data.get('template'):
            raise serializers.ValidationError({
                'template': 'A resume template must be selected.'
            })
        
        return data

    def create(self, validated_data):
        # Ensure the resume is created for the current user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class ResumeDetailSerializer(ResumeSerializer):
    """
    Detailed serializer for resume with nested creation/update
    """
    work_experiences = WorkExperienceSerializer(many=True, required=False)
    education = EducationSerializer(many=True, required=False)
    skills = SkillSerializer(many=True, required=False)

    def create(self, validated_data):
        work_experiences = validated_data.pop('work_experiences', [])
        education = validated_data.pop('education', [])
        skills = validated_data.pop('skills', [])

        resume = super().create(validated_data)

        # Create nested objects
        for exp in work_experiences:
            WorkExperience.objects.create(resume=resume, **exp)
        
        for edu in education:
            Education.objects.create(resume=resume, **edu)
        
        for skill in skills:
            Skill.objects.create(resume=resume, **skill)

        return resume

    def update(self, instance, validated_data):
        # Handle nested updates
        work_experiences = validated_data.pop('work_experiences', None)
        education = validated_data.pop('education', None)
        skills = validated_data.pop('skills', None)

        # Update base resume
        instance = super().update(instance, validated_data)

        # Update nested objects if provided
        if work_experiences is not None:
            instance.work_experiences.all().delete()
            for exp in work_experiences:
                WorkExperience.objects.create(resume=instance, **exp)
        
        if education is not None:
            instance.education.all().delete()
            for edu in education:
                Education.objects.create(resume=instance, **edu)
        
        if skills is not None:
            instance.skills.all().delete()
            for skill in skills:
                Skill.objects.create(resume=instance, **skill)

        return instance
