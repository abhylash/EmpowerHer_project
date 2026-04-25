from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta, date
from .models import CycleLog
from .serializers import CycleLogSerializer, CyclePredictionSerializer

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def cycle_list(request):
    if request.method == 'GET':
        cycles = CycleLog.objects.filter(user=request.user.profile)
        serializer = CycleLogSerializer(cycles, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = CycleLogSerializer(data=request.data)
        if serializer.is_valid():
            # Calculate cycle length if previous cycle exists
            previous_cycle = CycleLog.objects.filter(user=request.user.profile).first()
            if previous_cycle and previous_cycle.start_date:
                cycle_length = (serializer.validated_data['start_date'] - previous_cycle.start_date).days
                if cycle_length > 0:
                    serializer.validated_data['cycle_length'] = cycle_length
            
            serializer.save(user=request.user.profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_cycle(request, pk):
    try:
        cycle = CycleLog.objects.get(pk=pk, user=request.user.profile)
    except CycleLog.DoesNotExist:
        return Response({'error': 'Cycle not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = CycleLogSerializer(cycle, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def prediction(request):
    cycles = CycleLog.objects.filter(user=request.user.profile, cycle_length__isnull=False)[:3]
    
    if not cycles:
        return Response({
            'next_period_date': None,
            'ovulation_start': None,
            'ovulation_end': None,
            'current_cycle_day': None,
            'current_phase': 'unknown',
            'days_until_period': None
        })
    
    # Calculate average cycle length
    avg_length = sum(cycle.cycle_length for cycle in cycles) // len(cycles)
    
    # Get last cycle start date
    last_cycle = cycles[0]
    days_since_last_period = (date.today() - last_cycle.start_date).days
    
    # Predict next period
    next_period = last_cycle.start_date + timedelta(days=avg_length)
    
    # Calculate ovulation window (typically 12-16 days before next period)
    ovulation_start = next_period - timedelta(days=16)
    ovulation_end = next_period - timedelta(days=12)
    
    # Determine current phase
    if days_since_last_period <= 5:
        current_phase = 'menstrual'
    elif days_since_last_period <= 13:
        current_phase = 'follicular'
    elif ovulation_start <= date.today() <= ovulation_end:
        current_phase = 'ovulatory'
    else:
        current_phase = 'luteal'
    
    days_until_period = (next_period - date.today()).days
    
    data = {
        'next_period_date': next_period,
        'ovulation_start': ovulation_start,
        'ovulation_end': ovulation_end,
        'current_cycle_day': days_since_last_period,
        'current_phase': current_phase,
        'days_until_period': days_until_period
    }
    
    serializer = CyclePredictionSerializer(data)
    return Response(serializer.data)
