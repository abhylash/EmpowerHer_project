from django.urls import path
from . import views

urlpatterns = [
    path('mood/', views.mood_list, name='mood_list'),
    path('patterns/', views.mood_patterns, name='mood_patterns'),
]
