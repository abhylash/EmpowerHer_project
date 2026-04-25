from django.urls import path
from . import views

urlpatterns = [
    path('', views.pregnancy_profile, name='pregnancy_profile'),
    path('weekly/', views.pregnancy_weekly, name='pregnancy_weekly'),
    path('symptoms/', views.pregnancy_symptoms, name='pregnancy_symptoms'),
]
