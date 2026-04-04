from django.urls import path
from . import views

urlpatterns = [
    path('', views.my_notifications, name='my-notifications'),
    path('unread-count/', views.unread_count, name='unread-count'),
    path('<int:notification_id>/read/', views.mark_as_read, name='mark-as-read'),
    path('mark-all-read/', views.mark_all_read, name='mark-all-read'),
    path('<int:notification_id>/delete/', views.delete_notification, name='delete-notification'),
]