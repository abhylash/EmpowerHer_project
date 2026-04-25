from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password')
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ('id', 'user', 'age', 'state', 'language', 'income_category', 
                 'occupation', 'health_conditions', 'is_pregnant', 'phone', 'created_at')
        read_only_fields = ('id', 'created_at')

class DashboardSerializer(serializers.Serializer):
    latest_cycle = serializers.DictField(read_only=True)
    today_mood = serializers.DictField(read_only=True)
    schemes_count = serializers.IntegerField(read_only=True)
    today_calories = serializers.FloatField(read_only=True)
