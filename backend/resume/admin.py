from django.contrib import admin
from .models import ResumeTemplate, Resume, Education, Skill, WorkExperience

admin.site.register(ResumeTemplate)
admin.site.register(Resume)
admin.site.register(Education)
admin.site.register(Skill)
admin.site.register(WorkExperience)