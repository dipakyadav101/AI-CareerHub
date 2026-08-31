from django.db import models


class InterviewSession(models.Model):
    INTERVIEW_TYPE_CHOICES = (
        ('Technical', 'Technical'),
        ('HR', 'HR'),
        ('Behavioral', 'Behavioral'),
    )

    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='interview_sessions',
    )
    interview_type = models.CharField(
        max_length=20,
        choices=INTERVIEW_TYPE_CHOICES,
    )
    questions_and_answers = models.JSONField(default=list)
    overall_score = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)
    answered_questions = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.interview_type} ({self.overall_score}%)"