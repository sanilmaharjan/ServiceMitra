from django.urls import path
from .create_job import create_job
from .get_job import get_jobs

urlpatterns = [
    path("create-job/", create_job),
    path("jobs/", get_jobs),
]