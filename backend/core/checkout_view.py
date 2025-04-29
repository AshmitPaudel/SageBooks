# checkout_view.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.shortcuts import get_object_or_404

from .models import Order, OrderItem, Product  
from .serializers import OrderSerializer, OrderItemSerializer

@api_view(['POST'])
@transaction.atomic
def create_order_with_items(request):
    user = request.user
    items_data = request.data.pop('order_items', [])

    # Create Order
    order_serializer = OrderSerializer(data=request.data, context={'request': request})
    if not order_serializer.is_valid():
        return Response(order_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    order = order_serializer.save(user=user)

    # Create OrderItems
    created_items = []
    for item_data in items_data:
        item_data['order'] = order.order_id
        item_data['product'] = item_data.get('product_id') 

        order_item_serializer = OrderItemSerializer(data=item_data)
        if not order_item_serializer.is_valid():
            transaction.set_rollback(True)
            return Response(order_item_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        order_item = order_item_serializer.save()
        created_items.append(OrderItemSerializer(order_item).data)

    response_data = {
        "order": OrderSerializer(order).data,
        "order_items": created_items
    }
    return Response(response_data, status=status.HTTP_201_CREATED)
