# manage_users_view.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from core.models import User, Order
from django.shortcuts import get_object_or_404 
from .serializers import UserSerializer

 # Get all users
@api_view(['GET'])
def manage_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)  
    return Response({"users": serializer.data}, status=status.HTTP_200_OK)

# Get a user by ID
@api_view(['GET'])
def get_user_by_id(request, user_id):
    user = get_object_or_404(User, user_id=user_id)
    serializer = UserSerializer(user)  
    return Response(serializer.data, status=status.HTTP_200_OK)

 # Remove a user 
@api_view(['DELETE'])
def delete_account(request, user_id):
    user = get_object_or_404(User, user_id=user_id)
    user.delete()
    return Response({"message": "User account deleted successfully"}, status=status.HTTP_200_OK)