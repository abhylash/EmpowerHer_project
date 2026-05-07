from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from datetime import date
from .models import HealthReport
from .serializers import HealthReportSerializer, ReportGenerationSerializer
from .tasks import generate_pdf_report

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def report_list(request):
    reports = HealthReport.objects.filter(user=request.user.profile)
    serializer = HealthReportSerializer(reports, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def generate_report(request):
    today = date.today()
    
    # Check if a report was already generated today
    existing_report = HealthReport.objects.filter(
        user=request.user.profile,
        report_month=today
    ).first()
    
    if existing_report:
        if existing_report.status == 'failed':
            existing_report.status = 'pending'
            existing_report.save()
            generate_pdf_report.delay(str(existing_report.id))
            return Response(
                HealthReportSerializer(existing_report).data, 
                status=status.HTTP_200_OK
            )
        # If it exists and isn't failed, just return the existing one
        return Response(
            HealthReportSerializer(existing_report).data, 
            status=status.HTTP_200_OK
        )
    
    # Create new report
    report = HealthReport.objects.create(
        user=request.user.profile,
        report_month=today,
        status='pending'
    )
    
    # Trigger Celery task
    generate_pdf_report.delay(str(report.id))
    
    return Response(
        HealthReportSerializer(report).data, 
        status=status.HTTP_201_CREATED
    )

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def download_report(request, pk):
    try:
        report = HealthReport.objects.get(pk=pk, user=request.user.profile)
        if report.status != 'ready':
            return Response(
                {'error': 'Report not ready'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response({
            'pdf_url': report.pdf_url
        })
    except HealthReport.DoesNotExist:
        return Response(
            {'error': 'Report not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
