from rest_framework import serializers
from .models import MoodLog

class MoodLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodLog
        fields = ('id', 'date', 'score', 'notes', 'cycle_day', 'created_at')
        read_only_fields = ('id', 'created_at')
    
    def validate_score(self, value):
        if not 1 <= value <= 10:
            raise serializers.ValidationError("Score must be between 1 and 10.")
        return value
    
    def validate_date(self, value):
        if not value:
            raise serializers.ValidationError("Date is required.")
        return value

class MoodPatternSerializer(serializers.Serializer):
    insight = serializers.CharField()
