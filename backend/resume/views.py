from rest_framework import viewsets, permissions, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Resume, ResumeTemplate
from .serializers import (
    ResumeSerializer, 
    ResumeDetailSerializer, 
    ResumeTemplateSerializer
)

class ResumeTemplateViewSet(viewsets.ReadOnlyModelViewSet):
    """
    View for listing and retrieving resume templates
    """
    queryset = ResumeTemplate.objects.filter(is_active=True)
    serializer_class = ResumeTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]

class ResumeViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for user's resumes
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ResumeDetailSerializer
        return ResumeSerializer

    def get_queryset(self):
        # Only allow users to see their own resumes
        return Resume.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except serializers.ValidationError as e:
            # Customize error response
            return Response({
                'status': 'error',
                'message': 'Invalid resume data',
                'errors': e.detail
            }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except serializers.ValidationError as e:
            # Customize error response
            return Response({
                'status': 'error',
                'message': 'Invalid resume update data',
                'errors': e.detail
            }, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        # Automatically set the user to the current user
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['POST'])
    def submit(self, request, pk=None):
        """
        Submit a resume for review or processing
        """
        resume = self.get_object()
        resume.status = 'submitted'
        resume.save()
        
        serializer = self.get_serializer(resume)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def drafts(self, request):
        """
        List all draft resumes for the current user
        """
        drafts = self.get_queryset().filter(status='draft')
        serializer = self.get_serializer(drafts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def completed(self, request):
        """
        List all completed resumes for the current user
        """
        completed = self.get_queryset().filter(status='completed')
        serializer = self.get_serializer(completed, many=True)
        return Response(serializer.data)
