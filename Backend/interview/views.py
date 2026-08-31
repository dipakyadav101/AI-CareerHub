from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import InterviewSession
from .serializers import InterviewSessionSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_interview_view(request):
    interview_type = request.data.get('interview_type')
    questions_and_answers = request.data.get('questions_and_answers', [])
    overall_score = request.data.get('overall_score', 0)
    total_questions = request.data.get('total_questions', 0)
    answered_questions = request.data.get('answered_questions', 0)

    if not interview_type:
        return Response(
            {'message': 'Interview type is required.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    session = InterviewSession.objects.create(
        user=request.user,
        interview_type=interview_type,
        questions_and_answers=questions_and_answers,
        overall_score=overall_score,
        total_questions=total_questions,
        answered_questions=answered_questions,
    )

    serializer = InterviewSessionSerializer(session)

    return Response(
        {
            'message': 'Interview session saved successfully.',
            'session': serializer.data,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def latest_interview_view(request):
    session = InterviewSession.objects.filter(
        user=request.user
    ).order_by('-created_at').first()

    if not session:
        return Response(
            {'message': 'No interview session found.'},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = InterviewSessionSerializer(session)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def interview_history_view(request):
    sessions = InterviewSession.objects.filter(
        user=request.user
    ).order_by('-created_at')

    serializer = InterviewSessionSerializer(sessions, many=True)
    return Response(serializer.data)