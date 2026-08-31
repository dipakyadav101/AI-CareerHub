from rest_framework import serializers
from .models import CareerPath, LearningTopic


class CareerPathSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerPath
        fields = [
            'id', 'title', 'description', 'required_skills',
            'salary_range', 'growth_info', 'created_at',
        ]


class LearningTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningTopic
        fields = [
            'id', 'title', 'description', 'related_skills',
            'level', 'duration', 'created_at',
        ]