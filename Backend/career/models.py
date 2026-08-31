from django.db import models


class CareerPath(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    required_skills = models.JSONField(default=list)
    salary_range = models.CharField(max_length=100, blank=True)
    growth_info = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class LearningTopic(models.Model):
    LEVEL_CHOICES = (
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    )

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    related_skills = models.JSONField(default=list)
    level = models.CharField(
        max_length=20,
        choices=LEVEL_CHOICES,
        default='Beginner',
    )
    duration = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title