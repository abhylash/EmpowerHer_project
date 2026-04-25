from rest_framework import serializers
from .models import MealLog

class MealLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealLog
        fields = ('id', 'date', 'meal_type', 'food_items', 'total_calories', 
                 'source', 'created_at')
        read_only_fields = ('id', 'created_at')
    
    def validate_food_items(self, value):
        if not value:
            return []
        return value
    
    def validate_total_calories(self, value):
        if value is None:
            return 0
        return value

class FoodAnalysisSerializer(serializers.Serializer):
    image = serializers.CharField(write_only=True)
    analysis = serializers.ListField(read_only=True)

class NutritionSummarySerializer(serializers.Serializer):
    calories = serializers.FloatField()
    protein = serializers.FloatField()
    carbs = serializers.FloatField()
    fat = serializers.FloatField()
    water = serializers.FloatField()
    steps = serializers.IntegerField()
