from rest_framework import generics, permissions
from .models import JobDescription
from .serializers import JobDescriptionSerializer

class JobDescriptionListCreateView(generics.ListCreateAPIView):
    """Allows authenticated users to list their job descriptions or upload/create new ones."""
    serializer_class = JobDescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return job descriptions belonging to the current user."""
        return JobDescription.objects.filter(user=self.request.user)

    # perform_create is handled within the serializer's create method by getting user from context
    # The serializer needs the request context, which ListCreateAPIView provides by default.
    # No need to override perform_create here unless adding extra logic.

class JobDescriptionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Allows authenticated users to retrieve, update, or delete their job descriptions."""
    serializer_class = JobDescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return job descriptions belonging to the current user."""
        return JobDescription.objects.filter(user=self.request.user)
