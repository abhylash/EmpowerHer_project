from django.urls import path
from . import views

urlpatterns = [
    path('', views.cycle_list, name='cycle_list'),
    path('<uuid:pk>/', views.update_cycle, name='update_cycle'),
    path('prediction/', views.prediction, name='prediction'),
]
