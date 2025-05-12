from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    RegisterSerializer, UserSerializer, ProfileSerializer, EducationSerializer,
    ExperienceSerializer, ProjectSerializer, SkillSerializer, CertificationSerializer,
    ProfileDetailSerializer # Optional: Use for profile retrieval
)
from django.contrib.auth.models import User
from .models import Profile, Education, Experience, Project, Skill, Certification

class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny] # Allow any user (authenticated or not) to access this endpoint

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            # You might want to return a token here as well upon successful registration
            return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "message": "User Created Successfully. Now perform Login to get your token."
        })
        except Exception as e:
            return Response({"error": str(e)}, status=400)

# Example of a view to get current user details (requires authentication)
class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# Use RetrieveUpdateAPIView for the user's profile (usually only one)
class ProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileDetailSerializer # Use the detailed serializer for GET
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Ensure the user has a profile, create if not (shouldn't happen with RegisterView)
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile

    # Override get_serializer_class if you want a simpler serializer for PUT/PATCH
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ProfileSerializer # Use basic serializer for updates
        return ProfileDetailSerializer # Use detailed for GET


# --- Base View for Profile Items --- 
class BaseProfileItemMixin:
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filter items belonging to the logged-in user's profile
        model_class = self.serializer_class.Meta.model
        return model_class.objects.filter(profile=self.request.user.profile)

    def perform_create(self, serializer):
        # Automatically set the profile to the logged-in user's profile
        serializer.save(profile=self.request.user.profile)

# --- Education Views --- 
class EducationListCreateView(BaseProfileItemMixin, generics.ListCreateAPIView):
    serializer_class = EducationSerializer

class EducationDetailView(BaseProfileItemMixin, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EducationSerializer
    lookup_field = 'pk'

# --- Experience Views --- 
class ExperienceListCreateView(BaseProfileItemMixin, generics.ListCreateAPIView):
    serializer_class = ExperienceSerializer

class ExperienceDetailView(BaseProfileItemMixin, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExperienceSerializer
    lookup_field = 'pk'

# --- Project Views --- 
class ProjectListCreateView(BaseProfileItemMixin, generics.ListCreateAPIView):
    serializer_class = ProjectSerializer

class ProjectDetailView(BaseProfileItemMixin, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer
    lookup_field = 'pk'

# --- Skill Views --- 
class SkillListCreateView(BaseProfileItemMixin, generics.ListCreateAPIView):
    serializer_class = SkillSerializer

class SkillDetailView(BaseProfileItemMixin, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SkillSerializer
    lookup_field = 'pk'

# --- Certification Views --- 
class CertificationListCreateView(BaseProfileItemMixin, generics.ListCreateAPIView):
    serializer_class = CertificationSerializer

class CertificationDetailView(BaseProfileItemMixin, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CertificationSerializer
    lookup_field = 'pk'
