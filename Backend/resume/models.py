from django.db import models


class Resume(models.Model):
    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='resumes',
    )
    file = models.FileField(upload_to='resumes/')
    file_name = models.CharField(max_length=255)
    resume_text = models.TextField(blank=True)

    # Analysis results
    score = models.IntegerField(default=0)
    score_label = models.CharField(max_length=50, blank=True)
    domain = models.CharField(max_length=50, blank=True)
    strengths = models.JSONField(default=list)
    missing_skills = models.JSONField(default=list)
    suggestions = models.JSONField(default=list)
    found_skills = models.JSONField(default=list)
    word_count = models.IntegerField(default=0)

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.file_name} ({self.user.email})"