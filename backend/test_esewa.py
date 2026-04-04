# test_your_esewa.py
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from payment.services import create_payment, get_esewa_form_data
from jobs.models import Job
from django.contrib.auth.models import User
from django.test.client import RequestFactory

# Get a job and client
job = Job.objects.first()
client = User.objects.first()

if not job or not client:
    print("Create a job and user first!")
    exit()

# Create fake request
factory = RequestFactory()
request = factory.get('/')
request.build_absolute_uri = lambda url: f"http://127.0.0.1:8000{url}"

# Create payment
payment = create_payment(job, client, 1000, 'esewa')
print(f"Payment created: {payment.id}")
print(f"Amount: {payment.amount}")
print(f"Commission: {payment.commission}")

# Get eSewa form data
esewa_data = get_esewa_form_data(payment, request)

# Generate HTML
html = f'''
<!DOCTYPE html>
<html>
<head><title>eSewa Test</title></head>
<body>
    <form action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST" id="esewa-form">
        <input type="hidden" name="amount" value="{esewa_data['amount']}">
        <input type="hidden" name="tax_amount" value="{esewa_data['tax_amount']}">
        <input type="hidden" name="total_amount" value="{esewa_data['total_amount']}">
        <input type="hidden" name="transaction_uuid" value="{esewa_data['transaction_uuid']}">
        <input type="hidden" name="product_code" value="{esewa_data['product_code']}">
        <input type="hidden" name="product_service_charge" value="{esewa_data['product_service_charge']}">
        <input type="hidden" name="product_delivery_charge" value="{esewa_data['product_delivery_charge']}">
        <input type="hidden" name="success_url" value="{esewa_data['success_url']}">
        <input type="hidden" name="failure_url" value="{esewa_data['failure_url']}">
        <input type="hidden" name="signed_field_names" value="{esewa_data['signed_field_names']}">
        <input type="hidden" name="signature" value="{esewa_data['signature']}">
    </form>
    <h2>Testing Your eSewa Integration</h2>
    <p>Amount: Rs. {payment.amount}</p>
    <p>Transaction UUID: {payment.transaction_uuid}</p>
    <p>Signature: {esewa_data['signature'][:50]}...</p>
    <button onclick="document.getElementById('esewa-form').submit()">Pay with eSewa</button>
</body>
</html>
'''

with open('test_my_esewa.html', 'w') as f:
    f.write(html)

print(f"✅ Open: test_my_esewa.html")