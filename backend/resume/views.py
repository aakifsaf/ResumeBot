from rest_framework import generics
from .models import ResumeTemplate, Resume
from .serializers import ResumeTemplateSerializer, ResumeSerializer

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
