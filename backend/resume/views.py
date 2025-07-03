from rest_framework import generics
from rest_framework.response import Response
from .models import ResumeTemplate, Resume
from .serializers import ResumeTemplateSerializer, ResumeSerializer, ManualResumeSerializer

class ResumeTemplateListView(generics.ListAPIView):
    queryset = ResumeTemplate.objects.filter(is_active=True)
    serializer_class = ResumeTemplateSerializer


class ResumeTemplateDetailView(generics.RetrieveAPIView):
    queryset = ResumeTemplate.objects.filter(is_active=True)
    serializer_class = ResumeTemplateSerializer


class ResumeListView(generics.ListCreateAPIView):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ResumeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer

class ManualResumeCreateView(generics.CreateAPIView):
    serializer_class = ManualResumeSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ResumePreviewView(generics.RetrieveAPIView):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    
    def get(self, request, *args, **kwargs):
        resume = self.get_object()
        # Add any additional processing for preview if needed
        serializer = self.get_serializer(resume)
        return Response(serializer.data)