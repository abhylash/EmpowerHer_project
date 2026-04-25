from celery import shared_task
from django.template.loader import render_to_string
from weasyprint import HTML
import os
from datetime import datetime
from .models import HealthReport

@shared_task
def generate_pdf_report(report_id):
    try:
        report = HealthReport.objects.get(id=report_id)
        report.status = 'processing'
        report.save()
        
        # Get user data for the report
        user = report.user.user
        profile = report.user
        
        # Get related data
        cycles = profile.cycles.all()[:3]
        moods = profile.moods.all()[:30]
        meals = profile.meals.all()[:30]
        
        # Get eligible schemes
        from apps.schemes.models import GovernmentScheme
        eligible_schemes = GovernmentScheme.objects.filter(is_active=True)[:5]
        
        # Render HTML template
        html_string = render_to_string('reports/monthly_report.html', {
            'user': user,
            'profile': profile,
            'cycles': cycles,
            'moods': moods,
            'meals': meals,
            'eligible_schemes': eligible_schemes,
            'report_month': report.report_month.strftime('%B %Y'),
            'generated_date': datetime.now().strftime('%d %B %Y'),
        })
        
        # Generate PDF
        pdf_path = f'media/reports/report_{report_id}.pdf'
        os.makedirs('media/reports', exist_ok=True)
        
        HTML(string=html_string).write_pdf(pdf_path)
        
        # Update report
        report.status = 'ready'
        report.pdf_url = f'/media/reports/report_{report_id}.pdf'
        report.generated_at = datetime.now()
        report.save()
        
        return f"Report {report_id} generated successfully"
        
    except Exception as e:
        report.status = 'failed'
        report.save()
        raise e
