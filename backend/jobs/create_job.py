from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from jobs.models import Job
from categories.models import Category
from users.models import CustomUser


@api_view(['POST'])
def create_job(request):

    data = request.data

    try:
        category = Category.objects.get(id=data['category'])
        client = CustomUser.objects.get(id=data['client'])

        job = Job.objects.create(
            title=data['title'],
            description=data['description'],
            category=category,
            budget=data['budget'],
            address=data['address'],
            city=data['city'],
            preferred_start_date=data.get('preferred_start_date'),
            preferred_deadline=data.get('preferred_deadline'),
            client=client,
            bidding_ends_at=data.get('bidding_ends_at'),
            images=data.get('images', [])
        )

        return Response({"message": "Job created successfully"}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)