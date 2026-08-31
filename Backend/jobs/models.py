from django.db import models


class Job(models.Model):
    JOB_TYPE_CHOICES = (
        ('Full Time', 'Full Time'),
        ('Part Time', 'Part Time'),
        ('Internship', 'Internship'),
        ('Contract', 'Contract'),
    )

    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    job_type = models.CharField(
        max_length=20,
        choices=JOB_TYPE_CHOICES,
        default='Full Time',
    )
    skills = models.JSONField(default=list)
    salary = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    responsibilities = models.JSONField(default=list)
    requirements = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.company}"


class Application(models.Model):
    STATUS_CHOICES = (
        ('Applied', 'Applied'),
        ('Under Review', 'Under Review'),
        ('Shortlisted', 'Shortlisted'),
        ('Rejected', 'Rejected'),
    )

    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='applications',
    )
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='applications',
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Applied',
    )
    match_percent = models.IntegerField(null=True, blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'job')

    def __str__(self):
        return f"{self.user.email} -> {self.job.title}"