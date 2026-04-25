from django.db import models
from django.contrib.auth.models import User
import uuid

class UserProfile(models.Model):
    LANGUAGE_CHOICES = [('en','English'),('hi','Hindi'),('kn','Kannada'),('ta','Tamil'),('te','Telugu')]
    INCOME_CHOICES = [('bpl','BPL'),('low','Low'),('mid','Middle'),('high','High')]
    OCCUPATION_CHOICES = [('labour','Daily Wage'),('farmer','Farmer'),
                         ('private','Private'),('govt','Govt'),('self','Self Employed')]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    age = models.IntegerField(null=True, blank=True)
    state = models.CharField(max_length=100, blank=True)
    language = models.CharField(max_length=5, choices=LANGUAGE_CHOICES, default='en')
    income_category = models.CharField(max_length=10, choices=INCOME_CHOICES, blank=True)
    occupation = models.CharField(max_length=20, choices=OCCUPATION_CHOICES, blank=True)
    health_conditions = models.JSONField(default=list)
    is_pregnant = models.BooleanField(default=False)
    phone = models.CharField(max_length=15, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        app_label = 'auth_app'
