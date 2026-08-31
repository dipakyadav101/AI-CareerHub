from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import CareerPath, LearningTopic
from .serializers import CareerPathSerializer, LearningTopicSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def career_path_list_view(request):
    paths = CareerPath.objects.all().order_by('-created_at')
    serializer = CareerPathSerializer(paths, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def learning_topic_list_view(request):
    topics = LearningTopic.objects.all().order_by('-created_at')
    serializer = LearningTopicSerializer(topics, many=True)
    return Response(serializer.data)