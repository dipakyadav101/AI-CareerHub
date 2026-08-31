from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model

from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    email = request.data.get('email', '').strip().lower()

    if User.objects.filter(email=email).exists():
        return Response(
            {'message': 'An account with this email already exists. Please sign in.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    data = request.data.copy()
    data['email'] = email

    serializer = RegisterSerializer(data=data)

    if not serializer.is_valid():
        return Response(
            {'message': 'Please check your details and try again.', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = serializer.save()
    token, _ = Token.objects.get_or_create(user=user)

    return Response(
        {
            'message': 'Account created successfully.',
            'token': token.key,
            'user': UserSerializer(user).data,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email', '').strip().lower()
    password = request.data.get('password', '')

    if not email or not password:
        return Response(
            {'message': 'Please enter your email and password.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not User.objects.filter(email=email).exists():
        return Response(
            {'message': 'No account found with this email. Please register first.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(request, username=email, password=password)

    if user is None:
        return Response(
            {'message': 'Incorrect password. Please try again.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    token, _ = Token.objects.get_or_create(user=user)

    return Response(
        {
            'message': 'Login successful.',
            'token': token.key,
            'user': UserSerializer(user).data,
        },
        status=status.HTTP_200_OK,
    )