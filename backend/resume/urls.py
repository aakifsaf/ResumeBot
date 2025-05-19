from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResumeViewSet, ResumeTemplateViewSet

router = DefaultRouter()
router.register(r'templates', ResumeTemplateViewSet, basename='resumetemplate')
router.register(r'resumes', ResumeViewSet, basename='resume')

urlpatterns = [
    path('', include(router.urls)),
]
