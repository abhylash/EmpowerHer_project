from rest_framework import serializers
from .models import PCODLog

class PCODLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = PCODLog
        fields = ('id', 'date', 'symptoms', 'weight', 'notes', 'created_at')
        read_only_fields = ('id', 'created_at')
