from django.urls import path
from .views import ResumeTemplateListView, ResumeTemplateDetailView, ResumeListView, ResumeDetailView, ManualResumeCreateView, ResumePreviewView

urlpatterns = [
    path('templates/', ResumeTemplateListView.as_view(), name='resumetemplate-list'),
    path('templates/<int:pk>/', ResumeTemplateDetailView.as_view(), name='resumetemplate-detail'),
    path('resumes/', ResumeListView.as_view(), name='resume-list'),
    path('resumes/<int:pk>/', ResumeDetailView.as_view(), name='resume-detail'),
    path('manual-resumes/', ManualResumeCreateView.as_view(), name='manual-resume-create'),
    path('resumes/<int:pk>/preview/', ResumePreviewView.as_view(), name='resume-preview'),
]