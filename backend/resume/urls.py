from django.urls import path
from .views import ResumeTemplateListView, ResumeTemplateDetailView, ResumeListView, ResumeDetailView


urlpatterns = [
    path('templates/', ResumeTemplateListView.as_view(), name='resumetemplate-list'),
    path('templates/<int:pk>/', ResumeTemplateDetailView.as_view(), name='resumetemplate-detail'),
    path('resumes/', ResumeListView.as_view(), name='resume-list'),
    path('resumes/<int:pk>/', ResumeDetailView.as_view(), name='resume-detail'),
]