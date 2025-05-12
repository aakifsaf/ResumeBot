from django.db import models
from django.contrib.auth.models import User

class JobDescription(models.Model):
    """Stores uploaded or submitted job descriptions and their parsed content."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_descriptions')
    title = models.CharField(max_length=255, blank=True, null=True, help_text="Optional title for the job description (e.g., Software Engineer at Google)")
    original_filename = models.CharField(max_length=255, blank=True, null=True, help_text="Original name of the uploaded file, if applicable.")
    raw_text = models.TextField(help_text="Raw text extracted from the file or submitted by the user.")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"JD for {self.user.username} - {self.title or self.original_filename or f'ID: {self.id}'}"

    class Meta:
        ordering = ['-uploaded_at']
