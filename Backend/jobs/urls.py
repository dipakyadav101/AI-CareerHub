from django.urls import path
from . import views

urlpatterns = [
    path('', views.job_list_view, name='job-list'),
    path('<int:job_id>/', views.job_detail_view, name='job-detail'),
    path('<int:job_id>/apply/', views.apply_job_view, name='job-apply'),
    path('applications/my/', views.my_applications_view, name='my-applications'),
]