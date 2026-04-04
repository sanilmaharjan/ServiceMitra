from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone
from users.models import CustomUser, ProviderProfile


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pending_verifications(request):
    """Admin: Get all unverified providers"""
    user = request.user.custom_user
    
    if user.role != 'admin':
        return Response({'error': 'Only admin can view pending verifications'}, status=403)
    
    pending_providers = ProviderProfile.objects.filter(is_verified=False)
    
    data = []
    for profile in pending_providers:
        data.append({
            'id': profile.id,
            'provider_id': profile.custom_user.id,
            'name': profile.custom_user.name,
            # 'business_name': profile.business_name,
            'phone': profile.custom_user.phone,
            'citizenship_number': profile.citizenship_number,
            'citizenship_image': profile.citizenship_image.url if profile.citizenship_image else None,
            'pan_number': profile.pan_number,
            'pan_image': profile.pan_image.url if profile.pan_image else None,
            'license_number': profile.license_number,
            'license_image': profile.license_image.url if profile.license_image else None,
            'insurance_provider': profile.insurance_provider,
            'years_experience': profile.years_experience,
            'categories': [cat.name for cat in profile.categories.all()],
            'created_at': profile.created_at
        })
    
    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_verification(request, provider_id):
    """Admin: Approve provider verification"""
    admin_user = request.user.custom_user
    
    if admin_user.role != 'admin':
        return Response({'error': 'Only admin can approve verification'}, status=403)
    
    provider = get_object_or_404(CustomUser, id=provider_id, role='service_provider')
    profile = get_object_or_404(ProviderProfile, custom_user=provider)
    
    profile.is_verified = True
    profile.verified_at = timezone.now()
    profile.verification_notes = request.data.get('notes', '')
    profile.save()
    
    return Response({
        'message': f'Provider {provider.name} verified successfully',
        'provider_id': provider.id,
        'is_verified': True
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_verification(request, provider_id):
    """Admin: Reject provider verification with reason"""
    admin_user = request.user.custom_user
    
    if admin_user.role != 'admin':
        return Response({'error': 'Only admin can reject verification'}, status=403)
    
    provider = get_object_or_404(CustomUser, id=provider_id, role='service_provider')
    profile = get_object_or_404(ProviderProfile, custom_user=provider)
    
    reason = request.data.get('reason', 'No reason provided')
    profile.verification_notes = reason
    profile.save()
    
    return Response({
        'message': f'Provider {provider.name} verification rejected',
        'reason': reason
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_verification_status(request):
    """Provider: Check own verification status"""
    user = request.user.custom_user
    
    if user.role != 'service_provider':
        return Response({'error': 'Only providers can check verification status'}, status=403)
    
    profile = get_object_or_404(ProviderProfile, custom_user=user)
    
    return Response({
        'is_verified': profile.is_verified,
        'verified_at': profile.verified_at,
        'verification_notes': profile.verification_notes
    })


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def submit_kyc(request):
    """Provider: Submit or update KYC documents"""
    user = request.user.custom_user
    
    if user.role != 'service_provider':
        return Response({'error': 'Only providers can submit KYC'}, status=403)
    
    profile = get_object_or_404(ProviderProfile, custom_user=user)
    
    # Update KYC fields
    # if 'business_name' in request.data:
    #     profile.business_name = request.data['business_name']
    
    if 'citizenship_number' in request.data:
        profile.citizenship_number = request.data['citizenship_number']
    if 'citizenship_image' in request.data:
        profile.citizenship_image = request.data['citizenship_image']
    if 'pan_number' in request.data:
        profile.pan_number = request.data['pan_number']
    if 'pan_image' in request.data:
        profile.pan_image = request.data['pan_image']
    if 'license_number' in request.data:
        profile.license_number = request.data['license_number']
    if 'license_image' in request.data:
        profile.license_image = request.data['license_image']
    if 'insurance_provider' in request.data:
        profile.insurance_provider = request.data['insurance_provider']
    if 'insurance_policy_number' in request.data:
        profile.insurance_policy_number = request.data['insurance_policy_number']
    if 'insurance_document' in request.data:
        profile.insurance_document = request.data['insurance_document']
    if 'years_experience' in request.data:
        profile.years_experience = request.data['years_experience']
    if 'hourly_rate' in request.data:
        profile.hourly_rate = request.data['hourly_rate']
    if 'description' in request.data:
        profile.description = request.data['description']
    if 'category_ids' in request.data:
        from categories.models import Category
        category_ids = request.data['category_ids']
        categories = Category.objects.filter(id__in=category_ids)
        profile.categories.set(categories)
    
    profile.save()
    
    return Response({
        'message': 'KYC submitted successfully',
        'is_verified': profile.is_verified,
        'needs_admin_approval': not profile.is_verified
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_all_users(request):
    """Admin: List all users"""
    admin_user = request.user.custom_user
    
    if admin_user.role != 'admin':
        return Response({'error': 'Only admin can view all users'}, status=403)
    
    users = CustomUser.objects.all().order_by('-created_at')
    
    data = []
    for user in users:
        user_data = {
            'id': user.id,
            'name': user.name,
            'email': user.user.email,
            'phone': user.phone,
            'role': user.role,
            'created_at': user.created_at,
        }
        
        if user.role == 'service_provider' and hasattr(user, 'provider_profile'):
            user_data['is_verified'] = user.provider_profile.is_verified
            user_data['name'] = user.name
        
        data.append(user_data)
    
    return Response(data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    """Admin: Delete a user"""
    admin_user = request.user.custom_user
    
    if admin_user.role != 'admin':
        return Response({'error': 'Only admin can delete users'}, status=403)
    
    user_to_delete = get_object_or_404(CustomUser, id=user_id)
    
    # Prevent admin from deleting themselves
    if user_to_delete.id == admin_user.id:
        return Response({'error': 'You cannot delete your own account'}, status=400)
    
    user_name = user_to_delete.name
    django_user = user_to_delete.user
    
    user_to_delete.delete()
    django_user.delete()
    
    return Response({
        'message': f'User {user_name} deleted successfully'
    }, status=204)