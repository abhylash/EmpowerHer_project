from rest_framework import serializers

class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField()
    history = serializers.ListField(required=False)
    language = serializers.CharField(default='en')

class FoodAnalysisRequestSerializer(serializers.Serializer):
    image = serializers.CharField()
