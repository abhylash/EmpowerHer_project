from rest_framework import serializers
from .models import HealthReport

class HealthReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthReport
        fields = ('id', 'report_month', 'status', 'pdf_url', 
                 'generated_at', 'created_at')
        read_only_fields = ('id', 'generated_at', 'created_at')

class ReportGenerationSerializer(serializers.Serializer):
    report_month = serializers.DateField()
    
    def validate_report_month(self, value):
        if not value:
            raise serializers.ValidationError("Report month is required.")
        return value
