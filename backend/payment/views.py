import time
import hmac
import hashlib
import base64
import requests
from decimal import Decimal
from django.utils import timezone
from django.http import JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import JobPayment as Payment
from jobs.models import Job
from users.models import CustomUser
from django.contrib.auth.models import User
from django.db.models import Sum


# ============= ESEWA PAYMENT =============

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initiate_esewa_payment(request):
    """Initiate eSewa payment"""
    amount = request.data.get('amount')
    job_id = request.data.get('job_id')
    
    if not amount:
        return Response({'error': 'Amount required'}, status=status.HTTP_400_BAD_REQUEST)
    
    transaction_uuid = 'TX' + str(int(time.time()))
    total_amount = str(int(float(amount)))
    product_code = "EPAYTEST"
    secret_key = "8gBm/:&EnhH.1/q"
    
    raw_string = f"total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={product_code}"
    
    signature = base64.b64encode(
        hmac.new(
            secret_key.encode('utf-8'),
            raw_string.encode('utf-8'),
            hashlib.sha256
        ).digest()
    ).decode('utf-8')
    
    esewa_data = {
        'amount': total_amount,
        'tax_amount': '0',
        'total_amount': total_amount,
        'transaction_uuid': transaction_uuid,
        'product_code': product_code,
        'product_service_charge': '0',
        'product_delivery_charge': '0',
        'success_url': 'http://localhost:5173/esewa-success',
        'failure_url': 'http://localhost:5173/esewa-failed',
        'signed_field_names': 'total_amount,transaction_uuid,product_code',
        'signature': signature,
    }
    
    return Response({
        'esewa_data': esewa_data,
        'esewa_url': 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'
    })

# ============= ESEWA CALLBACKS =============

@csrf_exempt
def esewa_success_callback(request):
    """eSewa redirects here after success"""
    ref_id = request.GET.get('refId')
    return HttpResponseRedirect(f'http://localhost:5173/esewa-success?refId={ref_id}')


@csrf_exempt
def esewa_failure_callback(request):
    """eSewa redirects here after failure"""
    return HttpResponseRedirect('http://localhost:5173/esewa-failed')


# ============= KHALTI PAYMENT =============

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initiate_khalti_payment(request):
    """Initiate Khalti payment"""
    amount = request.data.get('amount')
    job_id = request.data.get('job_id')
    
    if not amount:
        return Response({'error': 'Amount required'}, status=status.HTTP_400_BAD_REQUEST)
    
    khalti_secret_key = "live_secret_key_68791341fdd94846a146f0457ff7b455"
    amount_in_paisa = int(float(amount)) * 100
    
    user = request.user
    try:
        custom_user = CustomUser.objects.get(user=user)
        name = custom_user.name
        email = user.email
        phone = custom_user.phone
    except:
        name = user.username
        email = user.email or "user@example.com"
        phone = "9800000000"
    
    purchase_order_id = f'PO-{job_id}-{int(time.time())}'
    
    post_fields = {
        "return_url": "http://localhost:5173/khalti-success",
        "website_url": "http://localhost:5173",
        "amount": amount_in_paisa,
        "purchase_order_id": purchase_order_id,
        "purchase_order_name": f"Job Payment for #{job_id}",
        "customer_info": {
            "name": name,
            "email": email,
            "phone": phone
        }
    }
    
    headers = {
        'Authorization': f'Key {khalti_secret_key}',
        'Content-Type': 'application/json',
    }
    
    try:
        response = requests.post(
            'https://a.khalti.com/api/v2/epayment/initiate/',
            json=post_fields,
            headers=headers
        )
        
        response_data = response.json()
        
        if response.status_code == 200 and 'payment_url' in response_data:
            return Response({
                'success': True,
                'payment_url': response_data['payment_url'],
                'purchase_order_id': purchase_order_id
            })
        else:
            return Response({
                'error': response_data.get('error', 'Khalti payment failed')
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except:
        return Response({'error': 'Khalti payment failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ============= ADMIN PAYOUT VIEWS =============

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pending_providers(request):
    """Get all providers with pending balances"""
    if not request.user.is_staff:
        return Response({'error': 'Admin only'}, status=status.HTTP_403_FORBIDDEN)
    
    pending_providers = []
    providers = CustomUser.objects.filter(role='service_provider')
    
    for provider in providers:
        payments = Payment.objects.filter(
            provider=provider.user,
            status=Payment.PaymentStatus.FULL_PAID,
            released_at__isnull=True
        )
        
        total_pending = payments.aggregate(total=Sum('provider_amount'))['total'] or 0
        
        if total_pending > 0:
            pending_providers.append({
                'id': provider.user.id,
                'name': provider.name,
                'balance': float(total_pending),
            })
    
    return Response(pending_providers)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_pay_provider(request, provider_id):
    """Admin pays provider"""
    if not request.user.is_staff:
        return Response({'error': 'Admin only'}, status=status.HTTP_403_FORBIDDEN)
    
    amount = request.data.get('amount')
    payment_method = request.data.get('payment_method')
    
    if payment_method == 'esewa':
        return initiate_esewa_payment(request)
    else:
        return Response({'success': True, 'message': f'Cash payment of Rs. {amount} recorded'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_payment_history(request):
    """Get payout history"""
    return Response([])