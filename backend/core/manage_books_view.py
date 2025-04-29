# core/views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from core.models import Product
from core.serializers import ProductSerializer
from django.shortcuts import get_object_or_404

# Get all products
@api_view(['GET'])
def manage_books(request):
    products = Product.objects.all()  
    serializer = ProductSerializer(products, many=True) 
    return Response(serializer.data, status=status.HTTP_200_OK)


# Get product by ID
@api_view(['GET'])
def get_book_by_id(request, product_id):
    try:
        product = Product.objects.get(product_id=product_id)  
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(product)  
    return Response(serializer.data, status=status.HTTP_200_OK)

# Add a new product
@api_view(['POST'])
def add_book(request):
    serializer = ProductSerializer(data=request.data)  
    if serializer.is_valid():  
        serializer.save()  
        return Response(serializer.data, status=status.HTTP_201_CREATED)  
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  

# Update an existing product
@api_view(['PUT', 'PATCH'])
def update_book(request, product_id):

    try:
        product = Product.objects.get(product_id=product_id)  
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(product, data=request.data, partial=(request.method == 'PATCH'))
    if serializer.is_valid():  
        serializer.save()  
        return Response(serializer.data, status=status.HTTP_200_OK)  
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  


# Delete a product by ID
@api_view(['DELETE'])
def delete_book(request, product_id):
    product = get_object_or_404(Product, product_id=product_id)
    product.delete()
    return Response({"message": "Product deleted successfully."}, status=status.HTTP_204_NO_CONTENT)