from django.urls import path
from . import views

urlpatterns = [
    path('eligible/', views.EligibleSchemesView.as_view(), name='eligible_schemes'),
    path('all/', views.all_schemes, name='all_schemes'),
]
