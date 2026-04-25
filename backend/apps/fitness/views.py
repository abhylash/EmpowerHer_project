from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from datetime import date
import json
import base64
from .models import MealLog
from .serializers import MealLogSerializer, FoodAnalysisSerializer, NutritionSummarySerializer
from apps.ai_service.services import analyse_food_image

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def meal_list(request):
    if request.method == 'GET':
        date_filter = request.GET.get('date', date.today())
        meals = MealLog.objects.filter(user=request.user.profile, date=date_filter)
        serializer = MealLogSerializer(meals, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = MealLogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user.profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def analyse_photo(request):
    try:
        image_data = request.data.get('image')
        if not image_data:
            return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Remove data URL prefix if present
        if image_data.startswith('data:image/'):
            image_data = image_data.split(',')[1]
        
        analysis_result = analyse_food_image(image_data)
        
        # Parse the JSON result
        try:
            food_items = json.loads(analysis_result)
        except json.JSONDecodeError:
            return Response({'error': 'Failed to parse food analysis'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({'analysis': food_items})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def nutrition_summary(request):
    date_filter = request.GET.get('date', date.today())
    meals = MealLog.objects.filter(user=request.user.profile, date=date_filter)
    
    total_calories = sum(meal.total_calories for meal in meals)
    total_protein = 0
    total_carbs = 0
    total_fat = 0
    
    # Calculate macros from food items
    for meal in meals:
        for food_item in meal.food_items:
            total_protein += food_item.get('protein_g', 0)
            total_carbs += food_item.get('carb_g', 0)
            total_fat += food_item.get('fat_g', 0)
    
    # Mock data for water and steps (would come from other tracking)
    water = 2000  # ml
    steps = 8000  # steps
    
    data = {
        'calories': total_calories,
        'protein': total_protein,
        'carbs': total_carbs,
        'fat': total_fat,
        'water': water,
        'steps': steps
    }
    
    serializer = NutritionSummarySerializer(data)
    return Response(serializer.data)
