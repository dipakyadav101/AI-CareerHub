from django.urls import path
from . import views

urlpatterns = [
    path('', views.submit_interview_view, name='interview-submit'),
    path('latest/', views.latest_interview_view, name='interview-latest'),
    path('history/', views.interview_history_view, name='interview-history'),
]