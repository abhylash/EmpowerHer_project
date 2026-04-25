from rest_framework import serializers
from .models import CycleLog

class CycleLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CycleLog
        fields = ('id', 'start_date', 'end_date', 'flow_level', 'cramp_score', 
                 'mood', 'notes', 'cycle_length', 'created_at')
        read_only_fields = ('id', 'created_at')

class CyclePredictionSerializer(serializers.Serializer):
    next_period_date = serializers.DateField()
    ovulation_start = serializers.DateField()
    ovulation_end = serializers.DateField()
    current_cycle_day = serializers.IntegerField()
    current_phase = serializers.CharField()
    days_until_period = serializers.IntegerField()
