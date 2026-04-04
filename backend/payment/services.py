import hmac
import hashlib
import base64
import time
from decimal import Decimal
from .models import Payment

def generate_esewa_signature(total_amount, transaction_uuid, product_code, secret_key):
    raw_string = f"total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={product_code}"
    signature = base64.b64encode(
        hmac.new(
            secret_key.encode('utf-8'),
            raw_string.encode('utf-8'),
            hashlib.sha256
        ).digest()
    ).decode('utf-8')
    return signature

def create_payment(job, client, total_amount, payment_method):
    """Create payment record for a job"""
    payment = Payment.objects.create(
        job=job,
        client=client,
        total_amount=total_amount,
        payment_method=payment_method,
        provider=job.provider
    )
    payment.calculate_amounts()
    payment.save()
    return payment

def get_esewa_form_data(amount, transaction_uuid, payment_type, request):
    """Get eSewa form data for a specific payment layer"""
    secret_key = "8gBm/:&EnhH.1/q"  # Test key
    signature = generate_esewa_signature(
        str(amount),
        transaction_uuid,
        "EPAYTEST",
        secret_key
    )
    
    return {
        'amount': str(amount),
        'tax_amount': '0',
        'total_amount': str(amount),
        'transaction_uuid': transaction_uuid,
        'product_code': 'EPAYTEST',
        'product_service_charge': '0',
        'product_delivery_charge': '0',
        'success_url': request.build_absolute_uri(f'/api/payment/esewa-success/{payment_type}/'),
        'failure_url': request.build_absolute_uri('/api/payment/esewa-failure/'),
        'signed_field_names': 'total_amount,transaction_uuid,product_code',
        'signature': signature,
    }

def handle_advance_payment_success(ref_id, payment_id, transaction_uuid):
    """Handle successful advance (20%) payment"""
    payment = Payment.objects.get(id=payment_id)
    payment.mark_advance_paid(ref_id, transaction_uuid)
    payment.mark_held()
    return payment

def handle_final_payment_success(ref_id, payment_id, transaction_uuid):
    """Handle successful final (80%) payment"""
    payment = Payment.objects.get(id=payment_id)
    payment.mark_final_paid(ref_id, transaction_uuid)
    payment.mark_held()
    return payment

def release_payment_to_provider(payment_id):
    """Release 93% to provider after job completion"""
    payment = Payment.objects.get(id=payment_id)
    
    if payment.job.status == 'completed' and payment.final_paid:
        payment.release_to_provider()
        return True
    return False