from django.urls import path
from . import views

urlpatterns = [
    path('submit-kyc/', views.submit_kyc, name='submit-kyc'),
    path('my-status/', views.my_verification_status, name='my-status'),
    
    path('pending/', views.pending_verifications, name='pending-verifications'),
    path('<int:provider_id>/approve/', views.approve_verification, name='approve-verification'),
    path('<int:provider_id>/reject/', views.reject_verification, name='reject-verification'),
    
    path('users/', views.list_all_users, name='list-all-users'),
    path('users/<int:user_id>/delete/', views.delete_user, name='delete-user'),
]