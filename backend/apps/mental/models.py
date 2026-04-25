from django.db import models
from apps.auth_app.models import UserProfile
import uuid

class MoodLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='moods')
    date = models.DateField()
    score = models.IntegerField()  # 1-10
    notes = models.TextField(blank=True)
    cycle_day = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date']
