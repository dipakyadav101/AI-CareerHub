from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'password', 'account_type']

    def create(self, validated_data):
        email = validated_data['email']

        user = User.objects.create_user(
            username=email,
            email=email,
            full_name=validated_data['full_name'],
            account_type=validated_data.get('account_type', 'student'),
            password=validated_data['password'],
        )

        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'account_type']