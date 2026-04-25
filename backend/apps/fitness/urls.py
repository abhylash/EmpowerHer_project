from django.urls import path
from . import views

urlpatterns = [
    path('meals/', views.meal_list, name='meal_list'),
    path('meals/analyse-photo/', views.analyse_photo, name='analyse_photo'),
    path('summary/', views.nutrition_summary, name='nutrition_summary'),
]
