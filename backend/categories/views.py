from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Category
from .serializers import CategorySerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
def get_category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response({'message': 'Categories List retrieved!', 'data': serializer.data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def category_create(request):
    if request.user.custom_user.role != 'admin':
        return Response(
            {"error": "Only admin can create categories"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'New Category Created', 'data': serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def category_update(request, pk):
    if request.user.custom_user.role != 'admin':
        return Response(
            {"error": "Only admin can update categories"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response(
            {"error": "Category not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = CategorySerializer(category, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Category Updated', 'data': serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def category_delete(request, pk):
    if request.user.custom_user.role != 'admin':
        return Response(
            {"error": "Only admin can delete categories"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response(
            {"error": "Category not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    category.delete()
    return Response(
        {"message": "Category deleted successfully"},
        status=status.HTTP_204_NO_CONTENT
    )