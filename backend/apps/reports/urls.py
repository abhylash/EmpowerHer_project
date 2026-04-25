from django.urls import path
from . import views

urlpatterns = [
    path('', views.report_list, name='report_list'),
    path('generate/', views.generate_report, name='generate_report'),
    path('<uuid:pk>/download/', views.download_report, name='download_report'),
]
