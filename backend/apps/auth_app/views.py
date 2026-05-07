from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import UserProfile
from .serializers import UserSerializer, UserProfileSerializer, DashboardSerializer
from apps.cycles.models import CycleLog
from apps.mental.models import MoodLog
from apps.fitness.models import MealLog
from apps.schemes.models import GovernmentScheme
from datetime import date

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        UserProfile.objects.create(user=user)
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    from django.contrib.auth import authenticate
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def token_refresh(request):
    try:
        refresh_token = request.data.get('refresh')
        refresh = RefreshToken(refresh_token)
        return Response({
            'access': str(refresh.access_token),
        })
    except:
        return Response({'error': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def profile(request):
    profile = request.user.profile
    serializer = UserProfileSerializer(profile)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_profile(request):
    profile = request.user.profile
    serializer = UserProfileSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard(request):
    try:
        profile = request.user.profile
    except UserProfile.DoesNotExist:
        # Create profile if it doesn't exist to prevent 500 errors
        profile = UserProfile.objects.create(user=request.user)
    
    # Latest cycle
    latest_cycle = CycleLog.objects.filter(user=profile).first()
    cycle_data = {
        'start_date': latest_cycle.start_date if latest_cycle else None,
        'flow_level': latest_cycle.flow_level if latest_cycle else None,
        'cramp_score': latest_cycle.cramp_score if latest_cycle else None,
    } if latest_cycle else None
    
    # Today's mood
    today_mood = MoodLog.objects.filter(user=profile, date=date.today()).first()
    mood_data = {
        'score': today_mood.score if today_mood else None,
        'notes': today_mood.notes if today_mood else None,
    } if today_mood else None
    
    # Schemes count
    schemes_count = GovernmentScheme.objects.filter(is_active=True).count()
    
    # Today's calories
    today_meals = MealLog.objects.filter(user=profile, date=date.today())
    today_calories = sum(meal.total_calories for meal in today_meals)
    
    data = {
        'latest_cycle': cycle_data,
        'today_mood': mood_data,
        'schemes_count': schemes_count,
        'today_calories': today_calories,
    }
    
    serializer = DashboardSerializer(data)
    return Response(serializer.data)
