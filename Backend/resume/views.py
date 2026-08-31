from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Resume
from .serializers import ResumeSerializer


import json


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_resume_view(request):
    file_obj = request.FILES.get('file')
    resume_text = request.data.get('resume_text', '')

    if not file_obj:
        return Response(
            {'message': 'Please upload a resume file.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def parse_json_field(field_name):
        raw_value = request.data.get(field_name, '[]')
        try:
            return json.loads(raw_value)
        except (TypeError, ValueError):
            return []

    resume = Resume.objects.create(
        user=request.user,
        file=file_obj,
        file_name=file_obj.name,
        resume_text=resume_text,
        score=request.data.get('score', 0),
        score_label=request.data.get('score_label', ''),
        domain=request.data.get('domain', ''),
        strengths=parse_json_field('strengths'),
        missing_skills=parse_json_field('missing_skills'),
        suggestions=parse_json_field('suggestions'),
        found_skills=parse_json_field('found_skills'),
        word_count=request.data.get('word_count', 0),
    )

    serializer = ResumeSerializer(resume)

    return Response(
        {
            'message': 'Resume uploaded successfully.',
            'resume': serializer.data,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def latest_resume_view(request):
    resume = Resume.objects.filter(
        user=request.user
    ).order_by('-uploaded_at').first()

    if not resume:
        return Response(
            {'message': 'No resume found.'},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = ResumeSerializer(resume)
    return Response(serializer.data)