from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.auth_app.urls')),
    path('api/cycles/', include('apps.cycles.urls')),
    path('api/pcod/', include('apps.pcod.urls')),
    path('api/pregnancy/', include('apps.pregnancy.urls')),
    path('api/fitness/', include('apps.fitness.urls')),
    path('api/mental/', include('apps.mental.urls')),
    path('api/schemes/', include('apps.schemes.urls')),
    path('api/reports/', include('apps.reports.urls')),
    path('api/ai/', include('apps.ai_service.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
