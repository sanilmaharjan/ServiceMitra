from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from categories.models import Category

class CustomUser(models.Model):
    ROLE_CHOICES = (
        ('client', 'Client'),
        ('service_provider', 'Service Provider'),
        ('admin', 'Admin'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='custom_user')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client')

    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15)
    address = models.TextField()
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.role})"
    
class ProviderProfile(models.Model):
    custom_user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='provider_profile')

    citizenship_number = models.CharField(max_length=100)
    citizenship_image = models.ImageField(upload_to='kyc/citizenship/')

    # pan_number = models.CharField(max_length=20, blank=True, null=True)
    # pan_image = models.ImageField(upload_to='kyc/pan/', blank=True, null=True)

    license_number = models.CharField(max_length=100, blank=True, null=True)
    license_image = models.ImageField(upload_to='kyc/license/', blank=True, null=True)
    issuing_authority = models.CharField(max_length=255, blank=True, null=True)
    license_valid_until = models.DateField(blank=True, null=True)

    certificate_name = models.CharField(max_length=255, blank=True, null=True)
    certificate_image = models.ImageField(upload_to='kyc/certificate/', blank=True, null=True)
    training_provider = models.CharField(max_length=255, blank=True, null=True)

    insurance_provider = models.CharField(max_length=255, blank=True, null=True)
    insurance_policy_number = models.CharField(max_length=100, blank=True, null=True)
    insurance_document = models.FileField(upload_to='kyc/insurance/', blank=True, null=True)
    insurance_valid_until = models.DateField(blank=True, null=True)

    categories = models.ManyToManyField(Category, related_name='providers')
    years_experience = models.IntegerField(default=0)
    description = models.TextField(blank=True, null=True)

    is_verified = models.BooleanField(default=False)
    verification_notes = models.TextField(blank=True, null=True)
    verified_at = models.DateTimeField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        status = "Verified" if self.is_verified else "Pending"
        return f" {status}"

