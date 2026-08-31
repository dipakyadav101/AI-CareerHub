from rest_framework import serializers
from .models import InterviewSession


class InterviewSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewSession
        fields = [
            'id', 'interview_type', 'questions_and_answers',
            'overall_score', 'total_questions', 'answered_questions',
            'created_at',
        ]
        read_only_fields = ['created_at']