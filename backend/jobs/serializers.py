from rest_framework import serializers
from .models import Job, Bid


class JobSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['client', 'status', 'created_at', 'updated_at', 'started_at', 'completed_at']


class BidSerializer(serializers.ModelSerializer):
    provider_name = serializers.CharField(source='provider.name', read_only=True)
    provider_initials = serializers.SerializerMethodField()
    job_title = serializers.CharField(source='job.title', read_only=True)
    job_budget = serializers.CharField(source='job.budget', read_only=True)
    job_location = serializers.CharField(source='job.city', read_only=True)
    job_address = serializers.CharField(source='job.address', read_only=True)
    client_name = serializers.CharField(source='job.client.name', read_only=True)
    
    class Meta:
        model = Bid
        fields = '__all__'
        read_only_fields = ['provider', 'status', 'created_at', 'updated_at']

    def get_provider_initials(self, obj):
        if obj.provider and obj.provider.name:
            return ''.join([part[0] for part in obj.provider.name.split() if part]).upper()
        return ''