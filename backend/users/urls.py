from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    RegisterView, 
    UserDetailView, 
    ProfileDetailView,
    EducationListCreateView, EducationDetailView,
    ExperienceListCreateView, ExperienceDetailView,
    ProjectListCreateView, ProjectDetailView,
    SkillListCreateView, SkillDetailView,
    CertificationListCreateView, CertificationDetailView,
)

urlpatterns = [
    # Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User & Profile
    path('user/', UserDetailView.as_view(), name='user-detail'), 
    path('profile/', ProfileDetailView.as_view(), name='profile-detail'), 

    # Education
    path('education/', EducationListCreateView.as_view(), name='education-list-create'),
    path('education/<int:pk>/', EducationDetailView.as_view(), name='education-detail'),

    # Experience
    path('experience/', ExperienceListCreateView.as_view(), name='experience-list-create'),
    path('experience/<int:pk>/', ExperienceDetailView.as_view(), name='experience-detail'),

    # Projects
    path('projects/', ProjectListCreateView.as_view(), name='project-list-create'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),

    # Skills
    path('skills/', SkillListCreateView.as_view(), name='skill-list-create'),
    path('skills/<int:pk>/', SkillDetailView.as_view(), name='skill-detail'),

    # Certifications
    path('certifications/', CertificationListCreateView.as_view(), name='certification-list-create'),
    path('certifications/<int:pk>/', CertificationDetailView.as_view(), name='certification-detail'),
]