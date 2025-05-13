from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics # Add generics
from django.shortcuts import get_object_or_404
from django.conf import settings # To potentially load settings if needed, though we'll use os.environ directly for the key
from .models import GeneratedResume
import os
from dotenv import load_dotenv
from openai import OpenAI # Use OpenAI library for OpenRouter

from users.serializers import ProfileDetailSerializer # To get profile data
from jd_parser.models import JobDescription
from .serializers import GeneratedResumeSerializer # Add serializer import

# Load environment variables from .env file
load_dotenv()

class ComposeResumeView(APIView):
    """
    API endpoint to compose resume content based on a user's profile 
    and a specific job description using an AI model via OpenRouter.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        job_description_id = request.data.get('job_description_id')
        model_name = request.data.get('model', 'mistralai/mistral-7b-instruct:free') # Default model

        if not job_description_id:
            return Response({"error": "'job_description_id' is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            job_description_id = int(job_description_id)
        except ValueError:
             return Response({"error": "'job_description_id' must be an integer."}, status=status.HTTP_400_BAD_REQUEST)

        # --- Fetch Data ---
        user = request.user
        try:
            # Fetch the specific job description, ensuring it belongs to the user
            jd = get_object_or_404(JobDescription, pk=job_description_id, user=user)
            
            # Fetch the user's profile data using the existing serializer
            # Note: ProfileDetailSerializer includes nested data (Edu, Exp, etc.)
            profile_serializer = ProfileDetailSerializer(user.profile) # Assuming user.profile exists
            profile_data = profile_serializer.data
            
        except JobDescription.DoesNotExist:
             return Response({"error": "Job description not found or you do not have permission to access it."}, status=status.HTTP_404_NOT_FOUND)
        except AttributeError:
             # This might happen if user.profile doesn't exist, though RegisterView should create it.
             return Response({"error": "User profile not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Catch other potential errors during data fetching
            return Response({"error": f"Error fetching data: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        # --- Prepare for AI Call ---
        api_key = os.getenv('OPENROUTER_API_KEY')
        if not api_key:
            return Response({"error": "OpenRouter API key not configured in environment."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
        )

        # --- Construct the Prompt ---
        # This is a crucial part and may need significant refinement.
        prompt = f"""
        **Goal:** Generate an ATS-optimized, tailored resume for a specific job application, based on the provided user profile and job description.

        **User Profile:**
        ```json
        {profile_data}
        ```

        **Job Description:**
        ```text
        {jd.raw_text}
        ```

        **Instructions:**
            1. **ATS Optimization:** 
            - Prioritize keywords from the job description (skills, tools, certifications).
            - Use standard section headers (e.g., "Work Experience," "Projects," "Skills").
            - Avoid graphics/tables to ensure ATS readability.

            2. **Content Generation:**
            - **Professional Summary (3-4 sentences):** 
                - Highlight years of experience, core competencies, and alignment with the job’s mission.
                - Example: *"Results-driven [Job Title] with [X] years of experience in [Key Skill 1] and [Key Skill 2], seeking to leverage [Achievement] at [Target Company]."*

            - **Work Experience (STAR Method):**
                - For each role, generate 2-3 bullet points using: 
                - **Situation/Task:** Brief context.
                - **Action:** Strong action verbs (*Optimized, Led, Implemented*).
                - **Result:** Quantifiable outcomes (*"Improved performance by 30%"*).
                - Example: *"Led a cross-functional team to migrate legacy systems to AWS, reducing downtime by 40%."*

            - **Projects Section:**
                - Include 1-2 projects relevant to the job. For each:
                - **Title:** Project name + timeframe.
                - **Description:** Problem solved, tools used, and measurable impact.
                - Example: *"Inventory Management System (Python/Django, 2023): Developed a cloud-based system reducing stock discrepancies by 25%."*

            - **Skills (Categorized):**
                - Group into: *Technical Skills (Programming, Tools), Soft Skills, Certifications*.
                - Match exact terms from the job description (e.g., "React" vs. "JavaScript").

            3. **Formatting Rules:**
            - Use Markdown headers (## Work Experience, ### Projects).
            - Bold key achievements (**$2M cost savings**).
            - Keep bullets concise (1 line each).

        **Output:**
        Generate only the tailored resume content as requested above. Do not include greetings or introductory phrases.
        """

        # --- Make API Call ---
        try:
            completion = client.chat.completions.create(
                model=model_name,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert resume writer, skilled at tailoring resume content to specific job descriptions based on a user's profile.",
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    },
                ],
                # max_tokens=1500, # Optional: Adjust as needed
                # temperature=0.7, # Optional: Adjust creativity
            )
            
            generated_content = completion.choices[0].message.content

        except Exception as e:
            # Handle potential API errors (rate limits, invalid key, model not found, etc.)
            # Consider logging the error e
            return Response({"error": f"Error calling AI model: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # --- Save Result ---
        try:
            GeneratedResume.objects.create(
                user=user,
                job_description=jd,
                generated_content=generated_content
            )
        except Exception as e:
            # Optionally log this error, but still return the content to the user
            print(f"Error saving generated resume to database: {e}") # Simple print logging

        # --- Return Result ---
        return Response({"generated_content": generated_content}, status=status.HTTP_200_OK)


class GeneratedResumeListView(generics.ListAPIView):
    """
    API endpoint to list generated resumes for the authenticated user.
    Optionally filter by job_description_id query parameter.
    """
    serializer_class = GeneratedResumeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter resumes by the current user and optionally by job_description_id."""
        user = self.request.user
        queryset = GeneratedResume.objects.filter(user=user)

        # Optional filtering by job description ID
        job_description_id = self.request.query_params.get('job_description_id')
        if job_description_id:
            try:
                jd_id = int(job_description_id)
                queryset = queryset.filter(job_description__id=jd_id)
            except (ValueError, TypeError):
                # Silently ignore invalid job_description_id
                pass 
                
        return queryset.order_by('-created_at') # Already ordered in Meta, but explicit here

class GeneratedResumeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint to retrieve, update, or delete a specific generated resume by ID.
    """
    serializer_class = GeneratedResumeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """Retrieve the generated resume by ID, ensuring it belongs to the current user."""
        user = self.request.user
        resume_id = self.kwargs.get('pk')
        return get_object_or_404(GeneratedResume, pk=resume_id, user=user)

