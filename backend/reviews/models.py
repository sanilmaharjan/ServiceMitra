from django.db import models

from django.db import models
from users.models import CustomUser
from jobs.models import Job


class Review(models.Model):
    RATING_CHOICES = (
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    )
    
    job = models.OneToOneField(Job, on_delete=models.CASCADE, related_name='review')
    client = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reviews_given')
    provider = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reviews_received')
    
    rating = models.IntegerField(choices=RATING_CHOICES)
    comment = models.TextField()
    
    response = models.TextField(blank=True, null=True)
    responded_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.rating} - {self.provider.name} for {self.job.title}"
    
    class Meta:
        ordering = ['-created_at']
