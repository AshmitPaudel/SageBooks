# User Model

from django.contrib.auth.models import AbstractUser
import uuid
from django.db import models

class User(AbstractUser):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False) 
    profile_image = models.ImageField(upload_to='user_profile_images/', blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=50, default='user')
    email = models.EmailField(unique=True)  
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)  

    # Set email as the username for authentication
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  

    def __str__(self):
        return self.username or self.email  

# Product Model
class Product(models.Model):
    product_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product_name = models.CharField(max_length=255)
    author_name = models.CharField(max_length=255, blank=True, null=True)
    book_description = models.TextField(blank=True, null=True)
    product_image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    genre = models.CharField(max_length=100, blank=True, null=True)
    publisher = models.CharField(max_length=255, blank=True, null=True)
    format = models.CharField(max_length=50, blank=True, null=True)
    pages = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    stock_quantity = models.IntegerField(default=0)

    def __str__(self):
        return self.product_name



# Order Model
class Order(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Processing", "Processing"),
        ("Shipped", "Shipped"),
        ("Delivered", "Delivered"),
        ("Cancelled", "Cancelled"),
    ]

    order_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="Pending") 
    order_date = models.DateTimeField(auto_now_add=True)
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")  
    
    def __str__(self):
        return f"Order {self.order_id} by {self.user.username}"

    def total_quantity(self):
        return sum(item.quantity for item in self.order_items.all())

    def total_amount(self):
        return sum(item.total_price for item in self.order_items.all())

# OrderItem Model
class OrderItem(models.Model):
    order_item_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="order_items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):  
        self.total_price = self.quantity * self.price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"OrderItem {self.order_item_id} for {self.product.product_name}"


# Review Model
class Review(models.Model):
    review_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    comment = models.TextField()
    rating = models.IntegerField()
    review_date = models.DateTimeField(auto_now_add=True)
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")  
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="product_reviews")  

    def __str__(self):
        return f"Review for {self.product.product_name} by {self.user.username}"

    class Meta:
        constraints = [
            models.CheckConstraint(check=models.Q(rating__gte=1, rating__lte=5), name='rating_between_1_and_5'),
            models.UniqueConstraint(fields=['user', 'product'], name='unique_product_review')
        ]       
        
# ShippingInfo Model
class ShippingInfo(models.Model):
    shipping_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(max_length=255)
    payment_datetime = models.DateTimeField(auto_now_add=True)
    street_address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField()
    landmark = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="shipping_info")

    def __str__(self):
        return f"ShippingInfo for Order {self.order.order_id}"

# PaymentMethod Model
class PaymentMethod(models.Model):
    payment_method_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    method_name = models.CharField(max_length=50)

    def __str__(self):
        return self.method_name

# Transaction Model
class Transaction(models.Model):
    transaction_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment_status = models.CharField(max_length=50)
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.CASCADE)
    transaction_date = models.DateTimeField(auto_now_add=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="transactions")

    def __str__(self):
        return f"Transaction {self.transaction_id} for Order {self.order.order_id}"

# User-Cart Relationship
class UserCart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    class Meta:
        unique_together = ('user', 'product')

# User-Wishlist Relationship
class UserWishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    added_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

