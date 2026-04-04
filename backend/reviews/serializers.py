from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    provider_name = serializers.CharField(source='provider.name', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)
    
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['client', 'provider', 'created_at']