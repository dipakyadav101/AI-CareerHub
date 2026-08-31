from rest_framework import serializers
from .models import Job, Application


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'company', 'location', 'job_type',
            'skills', 'salary', 'description', 'responsibilities',
            'requirements', 'created_at',
        ]


class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    company = serializers.CharField(source='job.company', read_only=True)
    location = serializers.CharField(source='job.location', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 'job', 'job_title', 'company', 'location',
            'status', 'match_percent', 'applied_at',
        ]
        read_only_fields = ['status', 'applied_at']