# payment_view.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import PaymentMethod
from .serializers import PaymentMethodSerializer


# Fetch payment methods
@api_view(['GET'])
def get_available_payment_methods(request):
    payment_methods = PaymentMethod.objects.all()  
    serializer = PaymentMethodSerializer(payment_methods, many=True)  
    return Response({"available_payment_methods": serializer.data}, status=status.HTTP_200_OK)

# Add Payment Method 
@api_view(['POST'])
def add_payment_method(request):
    serializer = PaymentMethodSerializer(data=request.data)
    
    if serializer.is_valid():
        method_name = serializer.validated_data['method_name']
        
        if PaymentMethod.objects.filter(method_name=method_name).exists():
            return Response({"detail": "Payment method already exists."}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save()
        return Response({"detail": "Payment method added successfully."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Update payment method 
@api_view(['PUT'])
def update_payment_method(request, payment_method_id):
    try:
        payment_method = PaymentMethod.objects.get(payment_method_id=payment_method_id)
    except PaymentMethod.DoesNotExist:
        return Response({"detail": "Payment method not found."}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = PaymentMethodSerializer(payment_method, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"detail": "Payment method updated successfully."})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete payment method
@api_view(['DELETE'])
def delete_payment_method(request, payment_method_id):
    try:
        payment_method = PaymentMethod.objects.get(payment_method_id=payment_method_id)
    except PaymentMethod.DoesNotExist:
        return Response({"detail": "Payment method not found."}, status=status.HTTP_404_NOT_FOUND)
    
    payment_method.delete()
    return Response({"detail": "Payment method deleted successfully."}, status=status.HTTP_204_NO_CONTENT)