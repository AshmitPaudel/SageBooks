# transaction_view.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Transaction
from .serializers import TransactionSerializer
from django.db import transaction as db_transaction

# Get all transactions
@api_view(['GET'])
def get_all_transactions(request):
    transactions = Transaction.objects.all()
    if not transactions.exists():
        return Response({'message': 'No transactions found.'}, status=status.HTTP_200_OK)
    
    serializer = TransactionSerializer(transactions, many=True)
    return Response({'transactions': serializer.data}, status=status.HTTP_200_OK)

# Create transaction 
@api_view(['POST'])
def create_transaction(request):
    serializer = TransactionSerializer(data=request.data)
    if serializer.is_valid():
        with db_transaction.atomic():
            transaction_instance = serializer.save()
            
            order = transaction_instance.order
            
            for item in order.order_items.all():
                product = item.product
                
                if product.stock_quantity < item.quantity:
                    db_transaction.set_rollback(True)
                    return Response(
                        {'error': f'Insufficient stock for {product.product_name}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                    
                product.stock_quantity -= item.quantity
                product.save()
            
            order.order_status = "Processing"
            order.save()
                
        return Response(
            {
                'message': 'Transaction created, stock updated, and order marked as processing',
                'transaction': serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)