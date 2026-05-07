from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.http import StreamingHttpResponse
from .services import get_health_chat_response
from .serializers import ChatRequestSerializer, FoodAnalysisRequestSerializer

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def chat(request):
    serializer = ChatRequestSerializer(data=request.data)
    if serializer.is_valid():
        message = serializer.validated_data['message']
        history = serializer.validated_data.get('history', [])
        language = serializer.validated_data.get('language', 'en')
        
        full_response = ""
        for chunk in get_health_chat_response(message, language, history):
            full_response += chunk
            
        return Response({'message': full_response.strip()})
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
