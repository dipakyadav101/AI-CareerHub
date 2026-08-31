from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ACCOUNT_TYPE_CHOICES = (
        ('student', 'Student'),
        ('company', 'Company'),
    )

    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    account_type = models.CharField(
        max_length=10,
        choices=ACCOUNT_TYPE_CHOICES,
        default='student',
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'full_name']

    def __str__(self):
        return self.email