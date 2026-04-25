from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import PCODLog
from .serializers import PCODLogSerializer

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def pcod_logs(request):
    if request.method == 'GET':
        logs = PCODLog.objects.filter(user=request.user.profile)
        serializer = PCODLogSerializer(logs, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = PCODLogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user.profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
