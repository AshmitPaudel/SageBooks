#core/serializers.py 

from rest_framework import serializers
from .models import (
    User, Order, OrderItem, Product, UserCart,
    UserWishlist, PaymentMethod, ShippingInfo,
    Transaction, Review
)
# user serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'email', 'username', 'role','profile_image', 'phone_number'] 
         

# registration serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'phone_number']
        extra_kwargs = {
            'password': {'write_only': True}  
        }

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])  
        user.save()
        return user
    
    
# serializer for transaction
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            'transaction_id',
            'payment_status',
            'payment_method',
            'transaction_date',
            'order'
        ]   
    
#order item searilizer
class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.product_name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.DecimalField(read_only=True, max_digits=10, decimal_places=2)
    product_image = serializers.ImageField(source='product.product_image', read_only=True)
    class Meta:
        model = OrderItem
        fields = ['order_item_id', 'product', 'product_name', 'product_price', 'order', 'quantity', 'total_price','product_image']

    def validate(self, data):
        if data.get('quantity', 0) <= 0:
            raise serializers.ValidationError("Quantity must be greater than zero.")
        return data

    def create(self, validated_data):
        product = validated_data.get('product')
        quantity = validated_data.get('quantity')

        price = product.price  
        total_price = price * quantity

        validated_data['price'] = price  
        validated_data['total_price'] = total_price

        return OrderItem.objects.create(**validated_data)

  
#Order Searilizer    
class OrderSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(source='user.user_id', read_only=True)  
    username = serializers.CharField(source='user.username', read_only=True)  
    email = serializers.EmailField(source='user.email', read_only=True) 
    order_items = OrderItemSerializer(many=True, read_only=True) 
    transactions = TransactionSerializer(many=True, read_only=True)
    
    
    class Meta:
        model = Order
        fields = ['order_id', 'user_id', 'order_status', 'order_date', 'username', 'email','order_items','transactions']

       
# product serializer
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'  
    

# User Account Update Serializer
class AccountUpdateSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ['password']
        extra_kwargs = {
            'password': {'write_only': True},  
            'profile_image': {'required': False},  
            'phone_number': {'required': False},  
        }

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        for field, value in validated_data.items():
            setattr(instance, field, value)

        if password:
            instance.set_password(password)  
        instance.save()
        return instance
    
    
    
 # cart item serializer   
class CartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.UUIDField(source='product.product_id', read_only=True)  
    product_name = serializers.CharField(source='product.product_name', read_only=True)
    product_image = serializers.ImageField(source='product.product_image', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.DecimalField(read_only=True, max_digits=10, decimal_places=2)
    stock_quantity = serializers.IntegerField(source='product.stock_quantity', read_only=True)  
    
    class Meta:
        model = UserCart  
        fields = ['id', 'product_id', 'product_name', 'product_image', 'product_price', 'quantity', 'total_price','stock_quantity']

    def update(self, instance, validated_data):
        quantity = validated_data.get('quantity', instance.quantity)
        instance.quantity = quantity
        instance.total_price = instance.product.price * instance.quantity
        instance.save()
        return instance

    
# wishlist item serializer   
class WishlistItemSerializer(serializers.ModelSerializer):
    product_id = serializers.UUIDField(source='product.product_id', read_only=True)  
    product_name = serializers.CharField(source='product.product_name', read_only=True)
    product_image = serializers.ImageField(source='product.product_image', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    stock_status = serializers.SerializerMethodField()
    stock_quantity = serializers.IntegerField(source='product.stock_quantity', read_only=True) 

    class Meta:
        model = UserWishlist
        fields = ['id', 'product_id', 'product_name', 'product_image', 'product_price', 'stock_status', 'stock_quantity', 'added_date']

    def get_stock_status(self, obj):
        return "In Stock" if obj.product.stock_quantity > 0 else "Out of Stock"

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
    
    
# shipping info serializer 
class ShippingInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingInfo
        fields = '__all__'
        
        
# serializer for paymentMethod
class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ['payment_method_id', 'method_name'] 
       
        

        
 #rating and review        
class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True) 
    product_id = serializers.UUIDField(source='product.product_id', read_only=True)
    product_name = serializers.CharField(source='product.product_name', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'review_id',       
            'user',
            'username',
            'email',
            'product',
            'product_id',
            'product_name',
            'rating',
            'comment',
            'review_date',    
        ]
        read_only_fields = ['review_id', 'username', 'product_id', 'product_name', 'review_date', 'email']

    def validate(self, data):

        
        user = data.get('user')
        product = data.get('product')
        if not Order.objects.filter(
            user=user, 
            order_status='Delivered', 
            order_items__product=product
        ).exists():
            raise serializers.ValidationError("You can only review a product if you have a delivered order for it.")
        
        return data