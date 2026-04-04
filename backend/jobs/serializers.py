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
    
    class Meta:
        model = Bid
        fields = '__all__'
        read_only_fields = ['provider', 'status', 'created_at', 'updated_at']