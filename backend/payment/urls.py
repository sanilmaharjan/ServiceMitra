from django.urls import path
from . import views
from django.http import HttpResponse

# Optional test route
def test(request):
    return HttpResponse("PAYMENT WORKING")

urlpatterns = [
    path('test/', test),  # test route

    # eSewa routes
    path('initiate-esewa/', views.initiate_esewa_payment, name='initiate-esewa'),
    path('esewa-success/', views.esewa_success_callback, name='esewa-success'),
    path('esewa-failure/', views.esewa_failure_callback, name='esewa-failure'),

    # Khalti routes
    path('initiate-khalti/', views.initiate_khalti_payment, name='initiate-khalti'),
    path('khalti-success/', views.khalti_success_callback, name='khalti-success'),

    # Admin payment routes
    path('admin/pending-providers/', views.get_pending_providers, name='pending_providers'),
    path('admin/pay-provider/<int:provider_id>/', views.admin_pay_provider, name='admin_pay_provider'),
    path('admin/payment-history/', views.get_payment_history, name='payment_history'),
]