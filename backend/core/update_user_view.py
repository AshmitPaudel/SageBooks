#update_user_view.py 

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import AccountUpdateSerializer
from .models import User
from django.shortcuts import get_object_or_404

# Get user by id
@api_view(['PUT', 'PATCH'])
def update_user(request, user_id):
    user = get_object_or_404(User, user_id=user_id)
    serializer = AccountUpdateSerializer(user, data=request.data, partial=True)  
    
    if serializer.is_valid():
        serializer.save()  
        return Response({"message": "User account updated successfully."}, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
