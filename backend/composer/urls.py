from django.urls import path
from .views import ComposeResumeView

urlpatterns = [
    path('compose/', ComposeResumeView.as_view(), name='compose-resume'),
]
