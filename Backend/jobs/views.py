from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def job_list_view(request):
    jobs = Job.objects.all().order_by('-created_at')
    serializer = JobSerializer(jobs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def job_detail_view(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response(
            {'message': 'Job not found.'},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = JobSerializer(job)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_job_view(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response(
            {'message': 'Job not found.'},
            status=status.HTTP_404_NOT_FOUND,
        )

    if Application.objects.filter(user=request.user, job=job).exists():
        return Response(
            {'message': 'You have already applied to this job.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    match_percent = request.data.get('match_percent')

    application = Application.objects.create(
        user=request.user,
        job=job,
        match_percent=match_percent,
    )

    serializer = ApplicationSerializer(application)

    return Response(
        {
            'message': 'Application submitted successfully.',
            'application': serializer.data,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_applications_view(request):
    applications = Application.objects.filter(
        user=request.user
    ).order_by('-applied_at')

    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data)