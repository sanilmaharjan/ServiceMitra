from django.urls import path
from . import views

urlpatterns = [
<<<<<<< HEAD
    path('register/', views.register, name='register user'),
    path('login/', views.login, name='login user'),
    path('providers/',views.get_service_providers),
    path('providers/<int:id>/',views.get_provider_detail),
=======
    path('register/', views.register),
    path('login/', views.login),
    path('profile/', views.get_user_profile),
    path('providers/', views.get_service_providers),
    path('providers/<int:id>/', views.get_provider_detail),
>>>>>>> a4e8df5d4054650f1f6d7351e4ec0d47a55be2ff
]