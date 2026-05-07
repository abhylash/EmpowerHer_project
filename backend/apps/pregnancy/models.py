from django.db import models
from apps.auth_app.models import UserProfile
from datetime import timedelta
import uuid

class PregnancyProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='pregnancy')
    lmp_date = models.DateField()  # Last Menstrual Period
    is_delivered = models.BooleanField(default=False)
    delivery_date = models.DateField(null=True, blank=True)
    baby_gender = models.CharField(max_length=10, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    @property
    def edd(self):
        return self.lmp_date + timedelta(days=280)
    
    @property
    def current_week(self):
        from datetime import date
        weeks = (date.today() - self.lmp_date).days // 7
        return max(1, min(weeks, 40))
