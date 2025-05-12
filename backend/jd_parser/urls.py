from django.urls import path
from .views import JobDescriptionListCreateView, JobDescriptionDetailView

urlpatterns = [
    path('job-descriptions/', JobDescriptionListCreateView.as_view(), name='jobdescription-list-create'),
    path('job-descriptions/<int:pk>/', JobDescriptionDetailView.as_view(), name='jobdescription-detail'),
]
