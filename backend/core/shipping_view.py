# shipping_view.py

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ShippingInfo  
from .serializers import ShippingInfoSerializer  

# Retrieve all shipping info
@api_view(['GET'])
def get_shipping_info(request):
    shipping_info = ShippingInfo.objects.all()  

    if not shipping_info:  
        return Response(
            {"message": "No shipping information found."}, 
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ShippingInfoSerializer(shipping_info, many=True)

    return Response(
        {"shipping_info": serializer.data},
        status=status.HTTP_200_OK
    )

 # Add new shipping info
@api_view(['POST'])
def add_shipping_info(request):
    serializer = ShippingInfoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()  
        return Response({"message": "Shipping information added successfully!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Update shipping info by ID
@api_view(['PATCH'])
def update_shipping_info(request, shipping_id):
    try:
        shipping_info = ShippingInfo.objects.get(shipping_id=shipping_id)
    except ShippingInfo.DoesNotExist:
        return Response({"message": "Shipping information not found."}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ShippingInfoSerializer(shipping_info, data=request.data, partial=True)  
    if serializer.is_valid():
        serializer.save()  
        return Response({"message": "Shipping information updated successfully!"}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete shipping info by ID
@api_view(['DELETE'])
def delete_shipping_info(request, shipping_id):
    try:
        shipping_info = ShippingInfo.objects.get(shipping_id=shipping_id)
    except ShippingInfo.DoesNotExist:
        return Response({"message": "Shipping information not found."}, status=status.HTTP_404_NOT_FOUND)
    
    shipping_info.delete()  
    return Response({"message": "Shipping information deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)
