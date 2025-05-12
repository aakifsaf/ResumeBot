from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from django.conf import settings # To potentially load settings if needed, though we'll use os.environ directly for the key

import os
from dotenv import load_dotenv
from openai import OpenAI # Use OpenAI library for OpenRouter

from users.serializers import ProfileDetailSerializer # To get profile data
from jd_parser.models import JobDescription

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
        **Goal:** Generate tailored resume sections (Summary, Experience bullet points, Skills) for a specific job application based on the provided user profile and job description.

        **User Profile:**
        ```json
        {profile_data}
        ```

        **Job Description:**
        ```text
        {jd.raw_text}
        ```

        **Instructions:**
        1.  **Analyze** the user profile and the job description.
        2.  **Identify** the key requirements, skills, and experiences mentioned in the job description.
        3.  **Match** these requirements with the user's profile information (summary, experiences, skills, projects, education, certifications).
        4.  **Generate** the following resume content, tailoring it specifically to the job description:
            *   **Professional Summary:** A concise (3-4 sentence) summary highlighting the most relevant qualifications and experience for THIS job.
            *   **Tailored Experience Bullet Points:** For EACH relevant experience entry in the user's profile, generate 2-3 impactful bullet points using the STAR method (Situation, Task, Action, Result) that directly address the requirements of the target job description. Use strong action verbs. If an experience is not relevant, skip it.
            *   **Relevant Skills List:** Extract and list the most relevant skills (technical and soft) from the user's profile that match the job description. Categorize them if appropriate (e.g., Programming Languages, Tools, Soft Skills).
        5.  **Format:** Present the output clearly, using markdown for sections (e.g., ## Professional Summary).

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

        # --- Return Result ---
        return Response({"generated_content": generated_content}, status=status.HTTP_200_OK)

