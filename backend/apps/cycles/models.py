from django.db import models
from apps.auth_app.models import UserProfile
import uuid

class CycleLog(models.Model):
    FLOW_CHOICES = [('light','Light'),('medium','Medium'),('heavy','Heavy')]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='cycles')
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    flow_level = models.CharField(max_length=10, choices=FLOW_CHOICES, default='medium')
    cramp_score = models.IntegerField(default=5)
    mood = models.CharField(max_length=50, blank=True)
    notes = models.TextField(blank=True)
    cycle_length = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-start_date']
