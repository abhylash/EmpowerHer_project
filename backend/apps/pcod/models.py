from django.db import models
from apps.auth_app.models import UserProfile
import uuid

class PCODLog(models.Model):
    SYMPTOM_CHOICES = [('irregular','Irregular Periods'),('acne','Acne'),
                       ('weight_gain','Weight Gain'),('hair_loss','Hair Loss')]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='pcod_logs')
    date = models.DateField()
    symptoms = models.JSONField(default=list)
    weight = models.FloatField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date']
