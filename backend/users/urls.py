from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register user'),
    path('login/', views.login, name='login user'),
    path('providers/',views.get_service_providers),
    path('providers/<int:id>/',views.get_provider_detail),
]