from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from datetime import date, timedelta
import json
from .models import MoodLog
from .serializers import MoodLogSerializer, MoodPatternSerializer
from apps.ai_service.services import analyse_mood_patterns

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def mood_list(request):
    if request.method == 'GET':
        moods = MoodLog.objects.filter(user=request.user.profile)[:30]
        serializer = MoodLogSerializer(moods, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = MoodLogSerializer(data=request.data)
        if serializer.is_valid():
            # Calculate cycle day if user has cycles
            from apps.cycles.models import CycleLog
            latest_cycle = CycleLog.objects.filter(user=request.user.profile).first()
            if latest_cycle and latest_cycle.start_date:
                days_since_period = (date.today() - latest_cycle.start_date).days
                serializer.validated_data['cycle_day'] = days_since_period
            
            serializer.save(user=request.user.profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def mood_patterns(request):
    # Get last 30 mood logs
    moods = MoodLog.objects.filter(user=request.user.profile)[:30]
    
    if len(moods) < 7:
        return Response({'insight': 'Not enough data yet. Keep logging your mood daily for better insights!'})
    
    # Convert to JSON for AI analysis
    mood_data = []
    for mood in moods:
        mood_data.append({
            'date': mood.date.isoformat(),
            'score': mood.score,
            'cycle_day': mood.cycle_day,
            'notes': mood.notes
        })
    
    try:
        insight = analyse_mood_patterns(json.dumps(mood_data), request.user.profile.language)
        return Response({'insight': insight})
    except Exception as e:
        return Response({'insight': 'Unable to analyze patterns at this time. Please try again later.'})
