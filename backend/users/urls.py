from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register),
    path('login/', views.login),
    path('profile/', views.get_user_profile),
    path('providers/', views.get_service_providers),
    path('providers/<int:id>/', views.get_provider_detail),
]