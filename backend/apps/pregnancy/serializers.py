from rest_framework import serializers
from .models import PregnancyProfile

class PregnancyProfileSerializer(serializers.ModelSerializer):
    current_week = serializers.ReadOnlyField()
    edd = serializers.ReadOnlyField()
    
    class Meta:
        model = PregnancyProfile
        fields = ('id', 'lmp_date', 'is_delivered', 'delivery_date', 
                 'baby_gender', 'current_week', 'edd', 'created_at')
        read_only_fields = ('id', 'created_at')

class PregnancyWeeklySerializer(serializers.Serializer):
    week = serializers.IntegerField()
    baby_size = serializers.CharField()
    baby_comparison = serializers.CharField()
    development = serializers.CharField()
    maternal_tip = serializers.CharField()
    nutrition_tip = serializers.CharField()

class PregnancySymptomSerializer(serializers.Serializer):
    symptoms = serializers.ListField(child=serializers.CharField())
    has_danger_signs = serializers.BooleanField()
    danger_signs = serializers.ListField(child=serializers.CharField())
