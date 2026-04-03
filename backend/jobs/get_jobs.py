from rest_framework.decorators import api_view
from rest_framework.response import Response
from jobs.models import Job
from jobs.serializers import JobSerializer


@api_view(['GET'])
def get_jobs(request):

    jobs = Job.objects.all()

    serializer = JobSerializer(jobs, many=True)

    return Response(serializer.data)