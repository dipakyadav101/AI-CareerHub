from django.urls import path
from . import views

urlpatterns = [
    path('', views.upload_resume_view, name='resume-upload'),
    path('latest/', views.latest_resume_view, name='resume-latest'),
]