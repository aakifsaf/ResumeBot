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
    
    # Personal Information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    
    # Professional Summary
    summary = models.TextField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}'s Resume"

class WorkExperience(models.Model):
    """
    Work experience entries for a resume
    """
    resume = models.ForeignKey(Resume, related_name='work_experiences', on_delete=models.CASCADE)
    company = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.position} at {self.company}"

class Education(models.Model):
    """
    Education entries for a resume
    """
    resume = models.ForeignKey(Resume, related_name='education', on_delete=models.CASCADE)
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    field_of_study = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    gpa = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.degree} from {self.institution}"

class Skill(models.Model):
    """
    Skills associated with a resume
    """
    resume = models.ForeignKey(Resume, related_name='skills', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    proficiency = models.CharField(
        max_length=20, 
        choices=[
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced'),
            ('expert', 'Expert')
        ]
    )

    def __str__(self):
        return self.name
