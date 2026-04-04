from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Notification
from .serializers import NotificationSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_notifications(request):
    """Get all notifications for logged-in user"""
    user = request.user.custom_user
    notifications = Notification.objects.filter(user=user)
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unread_count(request):
    """Get count of unread notifications"""
    user = request.user.custom_user
    count = Notification.objects.filter(user=user, is_read=False).count()
    return Response({'unread_count': count})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_as_read(request, notification_id):
    """Mark a single notification as read"""
    user = request.user.custom_user
    notification = get_object_or_404(Notification, id=notification_id, user=user)
    notification.is_read = True
    notification.read_at = timezone.now()
    notification.save()
    return Response({'message': 'Notification marked as read'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_read(request):
    """Mark all notifications as read for logged-in user"""
    user = request.user.custom_user
    count = Notification.objects.filter(user=user, is_read=False).update(is_read=True, read_at=timezone.now())
    return Response({'message': f'{count} notifications marked as read'})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_notification(request, notification_id):
    """Delete a notification"""
    user = request.user.custom_user
    notification = get_object_or_404(Notification, id=notification_id, user=user)
    notification.delete()
    return Response({'message': 'Notification deleted'}, status=204)
