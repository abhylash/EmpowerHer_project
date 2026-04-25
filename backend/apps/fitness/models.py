from django.db import models
from apps.auth_app.models import UserProfile
import uuid

class MealLog(models.Model):
    MEAL_TYPES = [('breakfast','Breakfast'),('lunch','Lunch'),
                 ('dinner','Dinner'),('snack','Snack')]
    SOURCE_TYPES = [('manual','Manual'),('photo_ai','Photo AI'),('search','Search')]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='meals')
    date = models.DateField()
    meal_type = models.CharField(max_length=15, choices=MEAL_TYPES)
    food_items = models.JSONField(default=list)
    total_calories = models.FloatField(default=0)
    source = models.CharField(max_length=15, choices=SOURCE_TYPES, default='manual')
    created_at = models.DateTimeField(auto_now_add=True)
