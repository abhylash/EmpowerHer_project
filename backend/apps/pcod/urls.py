from django.urls import path
from . import views

urlpatterns = [
    path('logs/', views.pcod_logs, name='pcod_logs'),
]
