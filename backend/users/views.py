from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import CustomUser, ProviderProfile
from rest_framework_simplejwt.tokens import RefreshToken
from categories.models import Category
from django.contrib.auth import authenticate

@api_view(['POST'])
def register(request):
    data = request.data
    required = ['name', 'email', 'password', 'phone', 'role']
    for field in required:
        if field not in data:
            return Response({field: 'This field is required'}, status=400)
    
    if User.objects.filter(email=data['email']).exists():
        return Response({'email': 'Email already exists'}, status=400)
    
    user = User.objects.create_user(
        username=data['email'],
        email=data['email'],
        password=data['password']
    )
    
    custom_user = CustomUser.objects.create(
        user=user,
        name=data['name'],
        phone=data['phone'],
        address='',
        role=data['role'],
        profile_image=None
    )
    
    if data['role'] == 'service_provider':
        profile = ProviderProfile.objects.create(custom_user=custom_user)
        
        category_ids = data.get('category_ids', [])
        for cat_id in category_ids:
            try:
                category = Category.objects.get(id=cat_id)
                profile.categories.add(category)
            except Category.DoesNotExist:
                pass
    
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': custom_user.id,
            'name': custom_user.name,
            'email': custom_user.user.email,
            'role': custom_user.role
        }
    }, status=201)
    
@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({'error': 'Email and password required'}, status=400)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=401)
    
    user = authenticate(username=user.username, password=password)
    
    if not user:
        return Response({'error': 'Invalid credentials'}, status=401)
    
    custom_user = CustomUser.objects.get(user=user)
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': custom_user.id,
            'name': custom_user.name,
            'email': custom_user.user.email,
            'role': custom_user.role
        }
    })
    

