from django.db import models
import uuid

class GovernmentScheme(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    full_name = models.CharField(max_length=500)
    level = models.CharField(max_length=10, choices=[('central','Central'),('state','State')])
    states = models.JSONField(default=list)  # [] = all India
    benefit_amount = models.CharField(max_length=200)
    benefit_description = models.TextField()
    eligibility_rules = models.JSONField(default=dict)
    applicable_to = models.JSONField(default=list)
    apply_link = models.URLField(blank=True)
    helpline = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
