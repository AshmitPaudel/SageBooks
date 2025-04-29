# ratings_reviews_view.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from core.models import Review, User, Order
from core.serializers import ReviewSerializer

# Get all reviews
@api_view(['GET'])
def get_all_reviews(request):
    reviews = Review.objects.all().order_by('-review_date')
    
    if not reviews.exists():
        return Response({'message': 'No reviews found.'}, status=status.HTTP_200_OK)
    
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Get reviews for a user
@api_view(['GET'])
def get_reviews_by_user(request, user_id):
    try:
        user = User.objects.get(user_id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    reviews = Review.objects.filter(user=user).order_by('-review_date')
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# get reviews for product 
@api_view(['GET'])
def get_reviews_by_product(request, product_id):
    reviews = Review.objects.filter(product=product_id).order_by('-review_date')
    
    if not reviews.exists():
        return Response({'message': 'No reviews found for this product.'}, status=status.HTTP_200_OK)
    
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# Add or update a user review for a product
@api_view(['POST'])
def add_review(request):
    if not request.user.is_authenticated:
        return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

    user = request.user  
    product = request.data.get('product')  

    if not product:
        return Response({"error": "Product is required."}, status=status.HTTP_400_BAD_REQUEST)

    has_delivered_order = Order.objects.filter(
        user=user, order_status="Delivered", order_items__product=product  
    ).exists()

    if not has_delivered_order:
        return Response({"error": "You can only review a product after receiving a delivered order."}, 
                        status=status.HTTP_400_BAD_REQUEST)

    existing_review = Review.objects.filter(user=user, product=product).first()

    if existing_review:
        serializer = ReviewSerializer(existing_review, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    serializer = ReviewSerializer(data={**request.data, "user": user.user_id, "product": product})  
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Delete a review by ID
@api_view(['DELETE'])
def delete_review(request, review_id):
    try:
        review = Review.objects.get(review_id=review_id)
        review.delete()
        return Response({"message": "Review deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    except Review.DoesNotExist:
        return Response({"error": "Review not found."}, status=status.HTTP_404_NOT_FOUND)



@api_view(['GET'])
def has_user_reviewed_product(request, product_id):
    if not request.user.is_authenticated:
        return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
    
    user = request.user 

    review_exists = Review.objects.filter(user=user, product=product_id).exists()

    return Response({'reviewed': review_exists}, status=status.HTTP_200_OK)
