from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, Education, Experience, Project, Skill, Certification # Import all models

class UserSerializer(serializers.ModelSerializer):
    # Add profile fields if you want to return them with the user
    # profile = ProfileSerializer(read_only=True) # Example if you have a ProfileSerializer
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name') # Specify fields you want to expose

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, label='Confirm password', style={'input_type': 'password'})
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."}) 
        # Check if email already exists
        if User.objects.filter(email=attrs['email']).exists():
             raise serializers.ValidationError({"email": "Email already exists."})    
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )

        user.set_password(validated_data['password']) # Hash the password
        user.save()

        # Create a profile instance for the new user
        Profile.objects.create(user=user)

        return user

class ProfileSerializer(serializers.ModelSerializer):
    # Make user field read-only as it shouldn't be changed via the profile endpoint
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        # Exclude user if you handle setting it implicitly in the view, 
        # or make it read-only as done above
        fields = '__all__' 
        read_only_fields = ('user',)

class EducationSerializer(serializers.ModelSerializer):
    # profile = serializers.PrimaryKeyRelatedField(read_only=True) # Make profile read-only or exclude
    class Meta:
        model = Education
        fields = '__all__'
        read_only_fields = ('profile',)

class ExperienceSerializer(serializers.ModelSerializer):
    # profile = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Experience
        fields = '__all__'
        read_only_fields = ('profile',)

class ProjectSerializer(serializers.ModelSerializer):
    # profile = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ('profile',)

class SkillSerializer(serializers.ModelSerializer):
    # profile = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Skill
        fields = '__all__'
        read_only_fields = ('profile',)

class CertificationSerializer(serializers.ModelSerializer):
    # profile = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Certification
        fields = '__all__'
        read_only_fields = ('profile',)

# Optional: Update ProfileSerializer to include nested related data
class ProfileDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    education = EducationSerializer(many=True, read_only=True)
    experiences = ExperienceSerializer(many=True, read_only=True)
    projects = ProjectSerializer(many=True, read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    certifications = CertificationSerializer(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = '__all__'