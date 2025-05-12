from rest_framework import serializers
from .models import JobDescription
import PyPDF2
import docx # python-docx
import io # To handle in-memory file operations

def extract_text_from_pdf(file_obj):
    """Extracts text from a PDF file object."""
    pdf_reader = PyPDF2.PdfReader(file_obj)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() or "" # Add fallback for empty pages
    return text

def extract_text_from_docx(file_obj):
    """Extracts text from a DOCX file object."""
    document = docx.Document(file_obj)
    text = "\n".join([paragraph.text for paragraph in document.paragraphs])
    return text

class JobDescriptionSerializer(serializers.ModelSerializer):
    # Allow file upload, but it's not directly mapped to a model field
    file = serializers.FileField(write_only=True, required=False, allow_null=True)
    # Make raw_text optional during creation if a file is provided
    raw_text = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = JobDescription
        fields = [
            'id', 'user', 'title', 'original_filename', 
            'raw_text', 'uploaded_at', 'updated_at', 
            'file' # Include file field for input
        ]
        read_only_fields = ['id', 'user', 'original_filename', 'uploaded_at', 'updated_at']

    def validate(self, data):
        """Ensure either raw_text or a file is provided."""
        file = data.get('file')
        raw_text = data.get('raw_text')

        if not file and not raw_text:
            raise serializers.ValidationError("Either a 'file' or 'raw_text' must be provided.")
        if file and raw_text:
            # Decide precedence or raise error? Let's prioritize file.
            # Alternatively, raise ValidationError("Provide either 'file' or 'raw_text', not both.")
            pass # If both provided, we'll process the file and ignore raw_text in create
        
        # Validate file type if provided
        if file:
            if not file.name.lower().endswith(('.pdf', '.docx')):
                raise serializers.ValidationError("Unsupported file type. Please upload a PDF or DOCX file.")
        
        return data

    def create(self, validated_data):
        """Handle file parsing and create JobDescription instance."""
        file = validated_data.pop('file', None)
        raw_text_input = validated_data.pop('raw_text', None) # Get raw_text if provided
        parsed_text = ""
        original_filename = None

        if file:
            original_filename = file.name
            # Use BytesIO to handle the InMemoryUploadedFile correctly
            file_content = io.BytesIO(file.read())
            if file.name.lower().endswith('.pdf'):
                try:
                    parsed_text = extract_text_from_pdf(file_content)
                except Exception as e:
                    raise serializers.ValidationError(f"Error processing PDF file: {e}")
            elif file.name.lower().endswith('.docx'):
                try:
                    parsed_text = extract_text_from_docx(file_content)
                except Exception as e:
                    raise serializers.ValidationError(f"Error processing DOCX file: {e}")
        elif raw_text_input:
             parsed_text = raw_text_input # Use provided text if no file

        if not parsed_text:
             raise serializers.ValidationError("Could not extract text from file or no text provided.")

        # Get user from context (passed by the view)
        user = self.context['request'].user 
        
        # Create the JobDescription instance
        jd = JobDescription.objects.create(
            user=user,
            raw_text=parsed_text,
            original_filename=original_filename,
            title=validated_data.get('title'), # Get title if provided
            **validated_data # Pass any other validated fields like title
        )
        return jd

    # Override to_representation to remove the 'file' field on output
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation.pop('file', None) # Don't show 'file' field in response
        # Ensure raw_text is included in the representation
        representation['raw_text'] = instance.raw_text 
        return representation
