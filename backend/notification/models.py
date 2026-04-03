from django.db import models
from users.models import CustomUser
from jobs.models import Job


class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('bid_received', 'New Bid Received'),
        ('bid_accepted', 'Bid Accepted'),
        ('bid_rejected', 'Bid Rejected'),
        ('job_assigned', 'Job Assigned to You'),
        ('job_started', 'Job Started'),
        ('job_completed', 'Job Completed'),
        ('job_cancelled', 'Job Cancelled'),
        ('payment_advance', 'Advance Payment Received'),
        ('payment_remaining', 'Full Payment Received'),
        ('payment_released', 'Payment Released to You'),
        ('review_received', 'New Review Received'),
        ('verification_approved', 'Account Verified'),
        ('verification_rejected', 'Verification Rejected'),
    )
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    
    job = models.ForeignKey(Job, on_delete=models.CASCADE, null=True, blank=True)
    
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.notification_type} - {self.user.name}"
    
    class Meta:
        ordering = ['-created_at']