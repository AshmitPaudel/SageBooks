#login_view.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token  # For token-based auth
from core.models import User # Custom User model 


@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    # Authenticate user
    user = authenticate(request, email=email, password=password)

    if user is not None:
        # Generate or or fetch token
        token, created = Token.objects.get_or_create(user=user)
        
        # Respond with token and user details
        return Response({
            "message": "Login successful",
            "token": token.key,
            "role": user.role,
            "user_id": user.user_id  
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            "message": "Invalid credentials"
        }, status=status.HTTP_400_BAD_REQUEST)  
