from django.db import models
from apps.auth_app.models import UserProfile
import uuid

class HealthReport(models.Model):
    STATUS = [('pending','Pending'),('processing','Processing'),
             ('ready','Ready'),('failed','Failed')]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='reports')
    report_month = models.DateField()
    status = models.CharField(max_length=15, choices=STATUS, default='pending')
    pdf_url = models.CharField(max_length=500, blank=True)
    generated_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
