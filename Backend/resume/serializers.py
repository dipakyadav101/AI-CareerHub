from rest_framework import serializers
from .models import Resume


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = [
            'id', 'file', 'file_name', 'resume_text',
            'score', 'score_label', 'domain', 'strengths',
            'missing_skills', 'suggestions', 'found_skills',
            'word_count', 'uploaded_at',
        ]
        read_only_fields = [
            'score', 'score_label', 'domain', 'strengths',
            'missing_skills', 'suggestions', 'found_skills',
            'word_count', 'uploaded_at',
        ]