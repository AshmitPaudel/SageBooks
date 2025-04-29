from django.urls import path

# User-related Views
from .login_view import login_view  
from .registration_view import register_view
from .update_user_view import update_user 
from .cart_view import get_cart_items, get_cart_by_user_id, add_to_cart, update_cart_item, remove_from_cart
from .wishlist_view import get_wishlist_items, get_wishlist_by_user_id, add_to_wishlist, remove_from_wishlist
from .ratings_reviews_view import get_all_reviews, get_reviews_by_user, delete_review, add_review, has_user_reviewed_product, get_reviews_by_product
from .checkout_view import create_order_with_items
# Admin-related Views
from .admin_dashboard_view import admin_dashboard 
from .manage_orders_view import get_orders, update_order_status, create_order, create_order_items, delete_orders, delete_order_by_id, get_orders_by_user_id, get_order_by_id, get_status_choices
from .manage_users_view import manage_users, get_user_by_id, delete_account 
from .manage_books_view import manage_books, get_book_by_id, add_book, update_book, delete_book
from .payment_view import get_available_payment_methods, add_payment_method, update_payment_method, delete_payment_method

# Shared Views
from .home_view import HomePageAPI, NewArrivalsAPI, BestSellersAPI, PopularAuthorsAPI, TopPublishersAPI, BooksYouMightLikeAPI, AllBooksAPI, FilteredBooksAPI, BookMetaInfoAPI
from .shipping_view import get_shipping_info, add_shipping_info
from .transaction_view import get_all_transactions, create_transaction

urlpatterns = [
  # Authentication
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'), 
    
    #admin 
    path('dashboard/', admin_dashboard, name='admin_dashboard'),
    path('manage-books/', manage_books, name='manage-books'),
    path('manage-books/<uuid:product_id>/', get_book_by_id, name='get_book_by_id'),
    path('add/', add_book, name='add_book'),  
    path('update-books/<uuid:product_id>/update/', update_book, name='update_book'),
    path('delete-book/<uuid:product_id>/delete/', delete_book, name='delete_book'),

    # orders
    path('orders/', get_orders, name='get_orders'),  
    path('orders/<uuid:order_id>/', get_order_by_id, name='get_order_by_id'),
    path('orders/user/<uuid:user_id>/', get_orders_by_user_id, name='get_orders_by_user_id'),
    path('order/<uuid:order_id>/', update_order_status, name='update_order_status'),
    path('create-order/', create_order, name='create_order'),
    path('create-order-items/', create_order_items, name='create_order_items'),
    path('order/delete-orders/<uuid:user_id>/', delete_orders, name='delete_user_orders'),
    path('order/delete-order/<uuid:order_id>/', delete_order_by_id, name='delete_order_by_id'),
    path('order-status-choices/', get_status_choices, name='order_status_choices'), 
    
    # checkout
    path('checkout/', create_order_with_items, name='checkout'), 
    
    # Users
    path('manage-users/', manage_users, name='manage_users'),
    path('delete-user/<uuid:user_id>/', delete_account, name='delete_user'),
    path('manage-users/<uuid:user_id>/', get_user_by_id, name='get_user_by_id'),
    path('update-user/<uuid:user_id>/', update_user, name='update_user'),  
    
    # Home 
    path('home/all-books/', AllBooksAPI.as_view(), name='all_books'),
    path('home/new-arrivals/', NewArrivalsAPI.as_view(), name='new-arrivals'),
    path('home/best-sellers/', BestSellersAPI.as_view(), name='best-sellers'),
    path('home/popular-authors/', PopularAuthorsAPI.as_view(), name='popular-authors'),
    path('home/top-publishers/', TopPublishersAPI.as_view(), name='top-publishers'),
    path('home/recommendations/', BooksYouMightLikeAPI.as_view(), name='recommendations'),
    
    #filter
    path('filter/', FilteredBooksAPI.as_view(), name='filtered-books'),
    path('home/meta-info/', BookMetaInfoAPI.as_view(), name='meta-info'),
    
    # cart 
    path('cart/', get_cart_items, name='get_cart_items'),  
    path('cart/add/', add_to_cart, name='add_to_cart'),  
    path('cart/update/<int:item_id>/', update_cart_item, name='update_cart_item'),  
    path('cart/delete/<int:item_id>/', remove_from_cart, name='remove_from_cart'),  
    path('cart/user/<uuid:user_id>/', get_cart_by_user_id, name='get_cart_by_user_id'),
    
    # wishlist
    path('wishlist/', get_wishlist_items, name='get_wishlist_items'),  
    path('wishlist/user/<uuid:user_id>/', get_wishlist_by_user_id, name='get_wishlist_by_user_id'),  
    path('wishlist/add/', add_to_wishlist, name='add_to_wishlist'),  
    path('wishlist/delete/<int:item_id>/', remove_from_wishlist, name='remove_from_wishlist'),  
    
    # payment 
    path('payment-methods/', get_available_payment_methods, name='get_available_payment_methods'),
    path('payment-methods/add/', add_payment_method, name='add_payment_method'),
    path('payment-methods/update/<uuid:payment_method_id>/', update_payment_method, name='update_payment_method'),
    path('payment-methods/delete/<uuid:payment_method_id>/', delete_payment_method, name='delete_payment_method'),
    
   # shipping 
    path('shipping-info/', get_shipping_info, name='get_shipping_info'),
    path('shipping-info/add/', add_shipping_info, name='add_shipping_info'),
  
  # transaction 
    path('transactions/', get_all_transactions, name='get_all_transactions'),
    path('transactions/add/', create_transaction, name='create_transaction'),
  
  # review
   path('reviews/', get_all_reviews, name='get_all_reviews'),
   path('reviews/user/<uuid:user_id>/', get_reviews_by_user, name='get_reviews_by_user'),
   path('reviews/add/', add_review, name='add_review'),
   path('reviews/delete/<uuid:review_id>/', delete_review, name='delete_review'),
   path('reviews/check/<uuid:product_id>/', has_user_reviewed_product, name='has_user_reviewed_product'),
   path('reviews/product/<uuid:product_id>/', get_reviews_by_product, name='get_reviews_by_product'),
  
  
]
