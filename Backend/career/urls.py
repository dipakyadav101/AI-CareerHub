from django.urls import path
from . import views

urlpatterns = [
    path('paths/', views.career_path_list_view, name='career-paths'),
    path('learning/', views.learning_topic_list_view, name='career-learning'),
        path('api/career/', include('career.urls')),
]