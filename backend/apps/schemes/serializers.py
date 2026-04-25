from rest_framework import serializers
from .models import GovernmentScheme

class GovernmentSchemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GovernmentScheme
        fields = ('id', 'name', 'full_name', 'level', 'states', 
                 'benefit_amount', 'benefit_description', 'eligibility_rules', 
                 'applicable_to', 'apply_link', 'helpline', 'is_active')
