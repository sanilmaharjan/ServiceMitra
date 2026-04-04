from django.shortcuts import render
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from .models import Job, Bid
from .serializers import JobSerializer, BidSerializer
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from django.shortcuts import get_object_or_404
from notification.models import Notification


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def job_list(request):
    user = request.user.custom_user
    
    if request.method == 'GET':
        if user.role == 'client':
            jobs = Job.objects.filter(client=user)
        
        elif user.role == 'service_provider':
            try:
                provider_profile = user.provider_profile
                provider_categories = provider_profile.categories.all()
                
                matching_jobs = Job.objects.filter(
                    status='pending',
                    category__in=provider_categories
                )
                assigned_jobs = Job.objects.filter(provider=user)
                
                jobs = matching_jobs | assigned_jobs
            except:
                jobs = Job.objects.none()
        
        else:
            jobs = Job.objects.all()
        
        status_filter = request.query_params.get('status')
        if status_filter:
            jobs = jobs.filter(status=status_filter)
        
        category_id = request.query_params.get('category')
        if category_id:
            jobs = jobs.filter(category_id=category_id)
        
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        if user.role != 'client':
            return Response({'error': 'Only clients can create jobs'}, status=403)
        
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            job = serializer.save(
                client=user,
                status='pending',
                bidding_ends_at=timezone.now() + timedelta(hours=24)
            )
            return Response(JobSerializer(job).data, status=201)
        return Response(serializer.errors, status=400)
    

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def job_detail(request, job_id):
    user = request.user.custom_user
    job = get_object_or_404(Job, id=job_id)
    
    if user.role == 'client' and job.client != user:
        return Response({'error': 'Access denied'}, status=403)
    if user.role == 'service_provider' and job.status != 'pending' and job.provider != user:
        return Response({'error': 'Access denied'}, status=403)
    
    if request.method == 'GET':
        serializer = JobSerializer(job)
        return Response(serializer.data)
    
    elif request.method in ['PUT', 'PATCH']:
        if user.role != 'client' or job.client != user:
            return Response({'error': 'Only the client can edit this job'}, status=403)
        if job.status != 'pending':
            return Response({'error': 'Cannot edit job after bids are received'}, status=400)
        
        serializer = JobSerializer(job, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    elif request.method == 'DELETE':
        if user.role != 'client' or job.client != user:
            return Response({'error': 'Only the client can delete this job'}, status=403)
        if job.status != 'pending':
            job.status = 'cancelled'
            job.save()
            return Response({'message': 'Job cancelled'})
        else:
            job.delete()
            return Response({'message': 'Job deleted'}, status=204)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_bid(request, job_id):
    user = request.user.custom_user
    job = get_object_or_404(Job, id=job_id)
    
    if user.role != 'service_provider':
        return Response({'error': 'Only service providers can bid'}, status=403)
    
    if not user.provider_profile.is_verified:
        return Response({'error': 'Your account is not verified yet'}, status=403)
    
    if job.status != 'pending':
        return Response({'error': 'Job is not accepting bids'}, status=400)
    
    if job.bidding_ends_at and timezone.now() > job.bidding_ends_at:
        return Response({'error': 'Bidding period has ended'}, status=400)
    
    if Bid.objects.filter(job=job, provider=user).exists():
        return Response({'error': 'You have already bid on this job'}, status=400)
    
    amount = request.data.get('amount')
    estimated_days = request.data.get('estimated_days')
    message = request.data.get('message', '')
    
    if not amount or not estimated_days:
        return Response({'error': 'Amount and estimated_days are required'}, status=400)
    
    bid = Bid.objects.create(
        job=job,
        provider=user,
        amount=amount,
        message=message,
        estimated_days=estimated_days
    )
    
    # Create notification for client
    Notification.objects.create(
        user=job.client,
        notification_type='bid_received',
        title='New Bid Received',
        message=f'{user.name} has placed a bid of ₹{amount} on your job "{job.title}"',
        job=job
    )
    
    serializer = BidSerializer(bid)
    return Response(serializer.data, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def job_bids(request, job_id):
    user = request.user.custom_user
    job = get_object_or_404(Job, id=job_id)
    
    if user.role == 'client' and job.client != user:
        return Response({'error': 'Only the client can view bids'}, status=403)
    if user.role == 'service_provider' and job.provider != user:
        return Response({'error': 'Access denied'}, status=403)
    
    bids = job.bids.all()
    serializer = BidSerializer(bids, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_bid(request, bid_id):
    user = request.user.custom_user
    bid = get_object_or_404(Bid, id=bid_id)
    job = bid.job
    
    if user.role != 'client' or job.client != user:
        return Response({'error': 'Only the client can accept bids'}, status=403)
    
    if job.status != 'pending':
        return Response({'error': 'Job is no longer accepting bids'}, status=400)
    
    bid.status = 'accepted'
    bid.save()
    
    # Notify the provider that their bid was accepted
    Notification.objects.create(
        user=bid.provider,
        notification_type='bid_accepted',
        title='Bid Accepted!',
        message=f'Your bid of ₹{bid.amount} for "{job.title}" has been accepted!',
        job=job
    )
    
    # Notify other bidders that their bids were rejected
    rejected_bids = Bid.objects.filter(job=job).exclude(id=bid.id)
    for rejected_bid in rejected_bids:
        rejected_bid.status = 'rejected'
        rejected_bid.save()
        
        Notification.objects.create(
            user=rejected_bid.provider,
            notification_type='bid_rejected',
            title='Bid Not Selected',
            message=f'Your bid for "{job.title}" was not selected. Another provider was chosen.',
            job=job
        )
    
    job.status = 'assigned'
    job.provider = bid.provider
    job.save()
    
    # Create job assigned notification for the provider
    Notification.objects.create(
        user=bid.provider,
        notification_type='job_assigned',
        title='Job Assigned to You',
        message=f'You have been assigned to work on "{job.title}". Please review the job details.',
        job=job
    )
    
    return Response({'message': 'Bid accepted successfully'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_bid(request, bid_id):
    user = request.user.custom_user
    bid = get_object_or_404(Bid, id=bid_id)
    job = bid.job
    
    if user.role != 'client' or job.client != user:
        return Response({'error': 'Only the client can reject bids'}, status=403)
    
    if job.status != 'pending':
        return Response({'error': 'Cannot reject bid at this stage'}, status=400)
    
    bid.status = 'rejected'
    bid.save()
    
    # Notify the provider that their bid was rejected
    Notification.objects.create(
        user=bid.provider,
        notification_type='bid_rejected',
        title='Bid Rejected',
        message=f'Your bid for "{job.title}" has been rejected by the client.',
        job=job
    )
    
    return Response({'message': 'Bid rejected'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_job(request, job_id):
    user = request.user.custom_user
    job = get_object_or_404(Job, id=job_id)
    
    if user.role != 'service_provider' or job.provider != user:
        return Response({'error': 'Only assigned provider can start the job'}, status=403)
    
    if job.status != 'assigned':
        return Response({'error': 'Job must be assigned before starting'}, status=400)
    
    job.status = 'in_progress'
    job.started_at = timezone.now()
    job.save()
    
    # Notify the client that job has started
    Notification.objects.create(
        user=job.client,
        notification_type='job_started',
        title='Job Started',
        message=f'{user.name} has started working on your job "{job.title}".',
        job=job
    )
    
    return Response({'message': 'Job started'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_job(request, job_id):
    user = request.user.custom_user
    job = get_object_or_404(Job, id=job_id)
    
    if user.role != 'service_provider' or job.provider != user:
        return Response({'error': 'Only assigned provider can complete the job'}, status=403)
    
    if job.status != 'in_progress':
        return Response({'error': 'Job must be in progress before completing'}, status=400)
    
    job.status = 'completed'
    job.completed_at = timezone.now()
    job.save()
    
    # Notify the client that job is completed
    Notification.objects.create(
        user=job.client,
        notification_type='job_completed',
        title='Job Completed',
        message=f'{user.name} has marked "{job.title}" as completed. Please review and release payment.',
        job=job
    )
    
    return Response({'message': 'Job completed'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_job(request, job_id):
    user = request.user.custom_user
    job = get_object_or_404(Job, id=job_id)
    
    if user.role == 'client' and job.client == user:
        pass
    elif user.role == 'service_provider' and job.provider == user and job.status == 'assigned':
        pass
    else:
        return Response({'error': 'You cannot cancel this job'}, status=403)
    
    job.status = 'cancelled'
    job.save()
    
    # Notify the other party about cancellation
    if user.role == 'client':
        if job.provider:
            Notification.objects.create(
                user=job.provider,
                notification_type='job_cancelled',
                title='Job Cancelled',
                message=f'The client has cancelled the job "{job.title}".',
                job=job
            )
    else:  # provider cancelled
        Notification.objects.create(
            user=job.client,
            notification_type='job_cancelled',
            title='Job Cancelled',
            message=f'The provider has cancelled the job "{job.title}".',
            job=job
        )
    
    return Response({'message': 'Job cancelled'})