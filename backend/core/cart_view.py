from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import UserCart  
from .serializers import CartItemSerializer  
from core.models import User  
from core.models import Product

# get cart items
@api_view(['GET'])
def get_cart_items(request):
    cart_items = UserCart.objects.filter(user=request.user)
    
    if not cart_items.exists():
        return Response({"message": "Your cart is empty."}, status=status.HTTP_200_OK)
    
    serializer = CartItemSerializer(cart_items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# get cart items by userid 
@api_view(['GET'])
def get_cart_by_user_id(request, user_id):
    
    user = get_object_or_404(User, user_id=user_id)  
    cart_items = UserCart.objects.filter(user=user)
    
    if not cart_items.exists():
        return Response({"message": "Cart is empty for this user."}, status=status.HTTP_200_OK)
    
    serializer = CartItemSerializer(cart_items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# add cart item
@api_view(['POST'])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))

    # Update quantity if the item already exists in the cart.
    existing_item = UserCart.objects.filter(user=request.user, product_id=product_id).first()
    if existing_item:
        existing_item.quantity += quantity
        existing_item.save()
        return Response(CartItemSerializer(existing_item).data, status=status.HTTP_200_OK)

    try:
        product = Product.objects.get(product_id=product_id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

    cart_item = UserCart.objects.create(
        user=request.user,
        product=product,
        quantity=quantity
    )
    cart_item.save()

    return Response(CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)

# update cart item
@api_view(['PUT'])
def update_cart_item(request, item_id):
    try:
        cart_item = UserCart.objects.get(id=item_id, user=request.user)
    except UserCart.DoesNotExist:
        return Response({"detail": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = CartItemSerializer(cart_item, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save() 
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# delete cart
@api_view(['DELETE'])
def remove_from_cart(request, item_id):
    cart_item = get_object_or_404(UserCart, id=item_id, user=request.user)
    cart_item.delete()
    return Response({"message": "Item removed from cart."}, status=status.HTTP_204_NO_CONTENT)
