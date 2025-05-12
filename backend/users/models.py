from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    email = models.EmailField(max_length=255, blank=True) # Kept for convenience, though User model has email
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    summary = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class Education(models.Model):
    profile = models.ForeignKey(Profile, related_name='education', on_delete=models.CASCADE)
    institution_name = models.CharField(max_length=255)
    degree = models.CharField(max_length=255)
    field_of_study = models.CharField(max_length=255, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True) # Can be ongoing
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.degree} from {self.institution_name}"

class Experience(models.Model):
    profile = models.ForeignKey(Profile, related_name='experiences', on_delete=models.CASCADE)
    company_name = models.CharField(max_length=255)
    job_title = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True) # Can be ongoing
    description = models.TextField() # Responsibilities, achievements
    location = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.job_title} at {self.company_name}"

class Project(models.Model):
    profile = models.ForeignKey(Profile, related_name='projects', on_delete=models.CASCADE)
    project_name = models.CharField(max_length=255)
    description = models.TextField()
    project_url = models.URLField(blank=True)
    technologies_used = models.CharField(max_length=500, blank=True) # Comma-separated or use a ManyToManyField to a Skill model later

    def __str__(self):
        return self.project_name

class Skill(models.Model):
    profile = models.ForeignKey(Profile, related_name='skills', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    # category = models.CharField(max_length=100, blank=True) # e.g., Programming Language, Framework, Tool

    def __str__(self):
        return self.name

class Certification(models.Model):
    profile = models.ForeignKey(Profile, related_name='certifications', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    issuing_organization = models.CharField(max_length=255)
    issue_date = models.DateField()
    expiration_date = models.DateField(null=True, blank=True)
    credential_id = models.CharField(max_length=255, blank=True)
    credential_url = models.URLField(blank=True)

    def __str__(self):
        return self.name
