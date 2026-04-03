from django.db import models
from categories.models import Category
from users.models import CustomUser

class Job(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('assigned', 'Assigned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),  # New status
    )
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    
    address = models.TextField()
    city = models.CharField(max_length=100)
    
    preferred_start_date = models.DateField(null=True, blank=True)
    preferred_deadline = models.DateField(null=True, blank=True)
    
    client = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='jobs_posted')
    provider = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='jobs_assigned')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Bidding deadline
    bidding_ends_at = models.DateTimeField(null=True, blank=True)
    
    # Images
    images = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.title} - {self.client.name}"
    
    @property
    def is_bidding_active(self):
        from django.utils import timezone
        if self.status != 'pending':
            return False
        if self.bidding_ends_at:
            return timezone.now() < self.bidding_ends_at
        return True
    
    def check_and_expire(self):
        from django.utils import timezone
        if self.status == 'pending' and self.bidding_ends_at and timezone.now() > self.bidding_ends_at:
            self.status = 'expired'
            self.save()
            return True
        return False
    
    class Meta:
        ordering = ['-created_at']
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('assigned', 'Assigned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
    )
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    
    address = models.TextField()
    city = models.CharField(max_length=100)
    
    preferred_start_date = models.DateField(null=True, blank=True)
    preferred_deadline = models.DateField(null=True, blank=True)
    
    client = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='jobs_posted')
    provider = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='jobs_assigned')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    bidding_ends_at = models.DateTimeField(null=True, blank=True)
    
    # Images
    images = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.title} - {self.client.name}"
    
    @property
    def is_bidding_active(self):
        from django.utils import timezone
        if self.status != 'pending':
            return False
        if self.bidding_ends_at:
            return timezone.now() < self.bidding_ends_at
        return True
    
    def check_and_expire(self):
        from django.utils import timezone
        if self.status == 'pending' and self.bidding_ends_at and timezone.now() > self.bidding_ends_at:
            self.status = 'expired'
            self.save()
            return True
        return False
    
    class Meta:
        ordering = ['-created_at']
        
class Bid(models.Model):
    BID_STATUS_CHOICES = (
        ('submitted', 'Submitted'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    )
    
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='bids')
    provider = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'provider'})
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    message = models.TextField(blank=True)
    estimated_days = models.IntegerField()
    status = models.CharField(max_length=20, choices=BID_STATUS_CHOICES, default='submitted')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['job', 'provider']
        ordering = ['amount']
    
    def __str__(self):
        return f"${self.amount} - {self.provider.name} for {self.job.title}"
    
    def accept(self):
        """Accept this bid and reject all others"""
        self.status = 'accepted'
        self.is_accepted = True
        self.save()
        
        self.job.bids.exclude(id=self.id).update(status='rejected')
        
        self.job.status = 'assigned'
        self.job.provider = self.provider
        self.job.save()
    
    def reject(self):
        self.status = 'rejected'
        self.save()