# manage_orders_view.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from core.models import Order, Product, OrderItem, User
from core.serializers import OrderSerializer, OrderItemSerializer
from rest_framework.exceptions import NotFound
from django.shortcuts import get_object_or_404

# Get all orders 
@api_view(['GET'])
def get_orders(request):
    orders = Order.objects.select_related('user').all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Get orders by user_id
@api_view(['GET'])
def get_orders_by_user_id(request, user_id):
    try:
        user = User.objects.get(user_id=user_id)  
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    orders = Order.objects.filter(user=user)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Get order by order_id
@api_view(['GET'])
def get_order_by_id(request, order_id):
    try:
        order = Order.objects.get(order_id=order_id)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = OrderSerializer(order)
    return Response(serializer.data, status=status.HTTP_200_OK)



#get status choices 
@api_view(['GET'])
def get_status_choices(request):
    STATUS_CHOICES = [
        {"value": "Pending", "label": "Pending"},
        {"value": "Processing", "label": "Processing"},
        {"value": "Shipped", "label": "Shipped"},
        {"value": "Delivered", "label": "Delivered"},
        {"value": "Cancelled", "label": "Cancelled"},
    ]
    return Response(STATUS_CHOICES)

#update order status 
@api_view(['PUT'])
def update_order_status(request, order_id):
    try:
        order = Order.objects.get(order_id=order_id)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('order_status')
    if new_status:
        order.order_status = new_status
        order.save()
        return Response({'message': 'Order status updated successfully'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Missing order_status in request'}, status=status.HTTP_400_BAD_REQUEST)

#Delete all orders by user id 
@api_view(['DELETE'])
def delete_orders(request, user_id):
    try:
        user = User.objects.get(user_id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    deleted_count, _ = Order.objects.filter(user=user).delete()

    return Response({'message': f'Deleted {deleted_count} orders for user {user_id}'}, status=status.HTTP_200_OK)

# Delete order by ID
@api_view(['DELETE'])
def delete_order_by_id(request, order_id):
    try:
        order = Order.objects.get(order_id=order_id)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    
    order.delete()
    return Response({'message': f'Order {order_id} deleted successfully'}, status=status.HTTP_200_OK)


# Create a new order
@api_view(['POST'])
def create_order(request):
    serializer = OrderSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        order = serializer.save(user=request.user)  
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Create Order Items
@api_view(['POST'])
def create_order_items(request):
    product_id = request.data.get('product_id')
    order_id = request.data.get('order_id')
    product = get_object_or_404(Product, product_id=product_id)
    order = get_object_or_404(Order, order_id=order_id)

    data = request.data.copy()
    data['product'] = product.product_id
    data['order'] = order.order_id

    serializer = OrderItemSerializer(data=data)

    if serializer.is_valid():
        order_item = serializer.save()  
        return Response(OrderItemSerializer(order_item).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)