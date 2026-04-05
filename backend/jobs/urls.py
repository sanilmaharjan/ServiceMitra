from django.urls import path
from . import views

urlpatterns = [
    # Job CRUD
    path('', views.job_list, name='job-list'),
    path('<int:job_id>/', views.job_detail, name='job-detail'),
    
    # Bidding
    path('<int:job_id>/bids/', views.create_bid, name='create-bid'),
    path('<int:job_id>/bids/list/', views.job_bids, name='job-bids'),
    path('my-bids/', views.my_bids, name='my-bids'),  # Provider's own bids
    
    # Bid actions
    path('bids/<int:bid_id>/accept/', views.accept_bid, name='accept-bid'),
    path('bids/<int:bid_id>/reject/', views.reject_bid, name='reject-bid'),
    
    # Job workflow
    path('<int:job_id>/start/', views.start_job, name='start-job'),
    path('<int:job_id>/complete/', views.complete_job, name='complete-job'),
    path('<int:job_id>/cancel/', views.cancel_job, name='cancel-job'),
]