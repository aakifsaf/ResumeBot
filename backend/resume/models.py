from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _

class ResumeTemplate(models.Model):
    """
    Predefined resume templates for users to choose from
    """
    TEMPLATE_CATEGORIES = [
        ('minimal', 'Modern Minimal'),
        ('creative', 'Creative Bold'),
        ('executive', 'Executive Classic')
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=TEMPLATE_CATEGORIES)
    description = models.TextField()
    primary_color = models.CharField(max_length=7, default='#1e88e5')
    secondary_color = models.CharField(max_length=7, default='#43a047')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Resume(models.Model):
    """
    User's individual resume instance
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('completed', 'Completed'),
        ('submitted', 'Submitted')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resumes')
    template = models.ForeignKey(ResumeTemplate, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=200, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resume_file = models.FileField(upload_to='resumes/', blank=True, null=True)
    personal_info = models.JSONField(default=dict, blank=True)
    work_experiences = models.JSONField(default=list, blank=True)
    education = models.JSONField(default=list, blank=True)
    projects = models.JSONField(default=list, blank=True)
    certifications = models.JSONField(default=list, blank=True)
    languages = models.JSONField(default=list, blank=True)
    skills = models.JSONField(default=list, blank=True)
    

    def __str__(self):
        return f"{self.user.username}'s Resume"


