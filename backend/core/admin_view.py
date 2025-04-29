# backend/core/admin_view.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def admin_home(request):
    return Response({"message": "Welcome to the Admin Panel API"}, status=status.HTTP_200_OK)
