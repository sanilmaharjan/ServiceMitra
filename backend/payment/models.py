from django.db import models
from django.conf import settings
from django.utils import timezone
from decimal import Decimal

class JobPayment(models.Model):
    class PaymentStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        ADVANCE_PAID = 'advance_paid', '20% Advance Paid'
        FULL_PAID = 'full_paid', '100% Paid'
        HELD = 'held', 'Held by Platform'
        RELEASED = 'released', 'Released to Provider'
        FAILED = 'failed', 'Failed'
    
    class PaymentMethod(models.TextChoices):
        ESEWA = 'esewa', 'E-Sewa'
        CASH = 'cash', 'Cash'
    
    job = models.OneToOneField('jobs.Job', on_delete=models.CASCADE, related_name='payment')
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payments_made')
    provider = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='payments_received')
    
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    advance_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    final_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    commission = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    provider_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    advance_paid = models.BooleanField(default=False)
    advance_paid_at = models.DateTimeField(null=True, blank=True)
    advance_ref_id = models.CharField(max_length=200, null=True, blank=True)
    advance_transaction_uuid = models.CharField(max_length=100, null=True, blank=True)
    
    final_paid = models.BooleanField(default=False)
    final_paid_at = models.DateTimeField(null=True, blank=True)
    final_ref_id = models.CharField(max_length=200, null=True, blank=True)
    final_transaction_uuid = models.CharField(max_length=100, null=True, blank=True)
    
    payment_method = models.CharField(max_length=10, choices=PaymentMethod.choices)
    status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    
    released_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Payment for {self.job.title} - {self.status}"
    
    def calculate_amounts(self):
        self.advance_amount = self.total_amount * Decimal('0.20')
        self.final_amount = self.total_amount - self.advance_amount
        self.commission = self.total_amount * Decimal('0.07')
        self.provider_amount = self.total_amount - self.commission
        return self
    
    def mark_advance_paid(self, ref_id=None, transaction_uuid=None):
        self.advance_paid = True
        self.advance_paid_at = timezone.now()
        if ref_id:
            self.advance_ref_id = ref_id
        if transaction_uuid:
            self.advance_transaction_uuid = transaction_uuid
        self.status = self.PaymentStatus.ADVANCE_PAID
        self.save()
    
    def mark_final_paid(self, ref_id=None, transaction_uuid=None):
        self.final_paid = True
        self.final_paid_at = timezone.now()
        if ref_id:
            self.final_ref_id = ref_id
        if transaction_uuid:
            self.final_transaction_uuid = transaction_uuid
        self.status = self.PaymentStatus.FULL_PAID
        self.save()
    
    def mark_held(self):
        self.status = self.PaymentStatus.HELD
        self.save()
    
    def release_to_provider(self):
        self.status = self.PaymentStatus.RELEASED
        self.released_at = timezone.now()
        self.save()