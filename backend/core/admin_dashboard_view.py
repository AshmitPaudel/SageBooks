from rest_framework.decorators import api_view
from rest_framework.response import Response
from core.models import User, Product, Order

@api_view(['GET'])
def admin_dashboard(request):
    total_orders = Order.objects.count()
    total_books = Product.objects.count()
    total_customers = User.objects.filter(role="user").count()
    pending_orders = Order.objects.filter(order_status__iexact="pending").count()


    data = {
        "total_orders": total_orders,
        "total_books": total_books,
        "total_customers": total_customers,
        "pending_orders": pending_orders,
    }
    return Response(data)
