from django.urls import path
from .views import ComposeResumeView, GeneratedResumeListView, GeneratedResumeDetailView, LatestGeneratedResumeView, GeneratedResumePreviewView

urlpatterns = [
    path('compose/', ComposeResumeView.as_view(), name='compose-resume'),
    path('generated-resumes/latest/', LatestGeneratedResumeView.as_view(), name='latest-generated-resume'),
    path('generated/', GeneratedResumeListView.as_view(), name='list-generated-resumes'), 
    path('generated/<int:pk>/', GeneratedResumeDetailView.as_view(), name='generated-resume-detail'),
    path('generated/<int:pk>/preview/', GeneratedResumePreviewView.as_view(), name='generated-resume-preview'),
]
