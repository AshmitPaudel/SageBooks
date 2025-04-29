from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import UserWishlist  
from .serializers import WishlistItemSerializer 
from core.models import User  
from core.models import Product

# get all wishlist 
@api_view(['GET'])
def get_wishlist_items(request):
    wishlist_items = UserWishlist.objects.filter(user=request.user)
    
    if not wishlist_items.exists():
        return Response({"message": "Your wishlist is empty."}, status=status.HTTP_200_OK)
    
    serializer = WishlistItemSerializer(wishlist_items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# 2. GET wishlist by user id
@api_view(['GET'])
def get_wishlist_by_user_id(request, user_id):
    user = get_object_or_404(User, user_id=user_id)  
    wishlist_items = UserWishlist.objects.filter(user=user)
    
    if not wishlist_items.exists():
        return Response({"message": "Wishlist is empty for this user."}, status=status.HTTP_200_OK)
    
    serializer = WishlistItemSerializer(wishlist_items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# Add item to wishlist 
@api_view(['POST'])
def add_to_wishlist(request):
    product_id = request.data.get('product_id')
    existing_item = UserWishlist.objects.filter(user=request.user, product_id=product_id).first()
    
    if existing_item:
        return Response({"message": "Product already in your wishlist."}, status=status.HTTP_200_OK)

    try:
        product = Product.objects.get(product_id=product_id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

    wishlist_item = UserWishlist.objects.create(
        user=request.user,
        product=product
    )
    wishlist_item.save()
    return Response(WishlistItemSerializer(wishlist_item).data, status=status.HTTP_201_CREATED)


# Remove wishlist 
@api_view(['DELETE'])
def remove_from_wishlist(request, item_id):
    wishlist_item = get_object_or_404(UserWishlist, id=item_id, user=request.user)
    wishlist_item.delete()
    return Response({"message": "Item removed from wishlist."}, status=status.HTTP_204_NO_CONTENT)
