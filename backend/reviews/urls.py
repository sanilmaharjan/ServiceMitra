from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_reviews, name='list-reviews'),
    path('<int:review_id>/', views.get_review, name='get-review'),
    path('job/<int:job_id>/', views.create_review, name='create-review'),
    path('<int:review_id>/update/', views.update_review, name='update-review'),
    path('<int:review_id>/delete/', views.delete_review, name='delete-review'),
    path('<int:review_id>/respond/', views.respond_to_review, name='respond-to-review'),
]