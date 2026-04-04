from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Review
from .serializers import ReviewSerializer
from jobs.models import Job
from django.utils import timezone


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request, job_id):
    user = request.user.custom_user
    job = get_object_or_404(Job, id=job_id)
    
    if user.role != 'client' or job.client != user:
        return Response({'error': 'Only the client can review this job'}, status=403)
    
    if job.status != 'completed':
        return Response({'error': 'Job must be completed before reviewing'}, status=400)
    
    if hasattr(job, 'review'):
        return Response({'error': 'Review already exists'}, status=400)
    
    rating = request.data.get('rating')
    comment = request.data.get('comment', '')
    
    if not rating:
        return Response({'error': 'Rating is required'}, status=400)
    
    review = Review.objects.create(
        job=job,
        client=user,
        provider=job.provider,
        rating=rating,
        comment=comment
    )
    
    serializer = ReviewSerializer(review)
    return Response(serializer.data, status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def respond_to_review(request, review_id):
    user = request.user.custom_user
    review = get_object_or_404(Review, id=review_id)
    
    # Only the provider who received the review can respond
    if user.role != 'service_provider' or review.provider != user:
        return Response({'error': 'Only the provider can respond to this review'}, status=403)
    
    response_text = request.data.get('response')
    if not response_text:
        return Response({'error': 'Response text is required'}, status=400)
    
    review.response = response_text
    review.responded_at = timezone.now()
    review.save()
    
    serializer = ReviewSerializer(review)
    return Response(serializer.data, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_review(request, review_id):
    review = get_object_or_404(Review, id=review_id)
    user = request.user.custom_user
    
    if user.role not in ['admin'] and user not in [review.client, review.provider]:
        return Response({'error': 'Access denied'}, status=403)
    
    serializer = ReviewSerializer(review)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_reviews(request):
    reviews = Review.objects.all()
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_review(request, review_id):
    user = request.user.custom_user
    review = get_object_or_404(Review, id=review_id)
    
    if user.role != 'client' or review.client != user:
        return Response({'error': 'Only the client can update this review'}, status=403)
    
    serializer = ReviewSerializer(review, data=request.data, partial=(request.method == 'PATCH'))
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_review(request, review_id):
    user = request.user.custom_user
    review = get_object_or_404(Review, id=review_id)
    
    if user.role != 'admin' and review.client != user:
        return Response({'error': 'You cannot delete this review'}, status=403)
    
    review.delete()
    return Response({'message': 'Review deleted'}, status=204)
