#registration_view.py 

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from rest_framework.authtoken.models import Token  
from .models import User  
from .serializers import UserSerializer  

@api_view(['POST'])
def register_view(request):
    email = request.data.get('email')
    username = request.data.get('username')
    password = request.data.get('password')

    if not email or not username or not password:
        return Response({"message": "Email, username, and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    # Validate unique email and username
    if User.objects.filter(email=email).exists():
        return Response({"message": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(username=username).exists():
        return Response({"message": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

    # Create new user with hashed password
    user = User.objects.create(
        email=email,
        username=username,
        password=make_password(password),  
    )
    
    # Generate authentication token
    token, created = Token.objects.get_or_create(user=user)
    user_data = UserSerializer(user).data

    return Response({
        "message": "Registration successful",
        "token": token.key,
        "user": user_data
    }, status=status.HTTP_201_CREATED)     