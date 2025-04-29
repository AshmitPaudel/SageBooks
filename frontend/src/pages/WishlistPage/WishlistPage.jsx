import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./WishlistPage.css";
import useNotificationToast from "../../components/NotificationToast/NotificationToast";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const notify = useNotificationToast();
  const [wishlistItems, setWishlistItems] = useState([]);
  const fetchWishlistItems = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/wishlist/user/${userId}/`
      );
      const wishlistData = response.data;
      const formattedWishlistItems = wishlistData.map((item) => ({
        id: item.id,
        product: item.product_id,
        product_name: item.product_name,
        product_image: `http://127.0.0.1:8000${item.product_image}`,
        product_price: item.product_price,
        stock_status: item.stock_status,
        added_date: item.added_date,
      }));

      setWishlistItems(formattedWishlistItems);
    } catch (err) {
      console.error("Error fetching wishlist items:", err);
      setWishlistItems([]);
    }
  }, [userId]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("User is not authenticated");
        return;
      }

      await axios.delete(`http://127.0.0.1:8000/api/wishlist/delete/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setWishlistItems(wishlistItems.filter((item) => item.id !== id));

      notify({
        message: "Item removed from wishlist",
        type: "success",
      });
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      notify({
        message: "Failed to remove item",
        type: "error",
      });
    }
  };

  const handleAddToCart = async (item) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("User is not authenticated");
        return;
      }
      const data = {
        product_id: item.product,
        quantity: 1,
      };
      await axios.post("http://127.0.0.1:8000/api/cart/add/", data, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      await axios.delete(
        `http://127.0.0.1:8000/api/wishlist/delete/${item.id}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setWishlistItems(
        wishlistItems.filter((wishlistItem) => wishlistItem.id !== item.id)
      );
      notify({
        message: "Item added to cart",
        type: "success",
      });
      console.log("Item added to cart and removed from wishlist");
    } catch (error) {
      console.error("Error moving item to cart:", error);
      notify({
        message: "Failed to add item to cart",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (userId) {
      fetchWishlistItems();
    }
  }, [userId, fetchWishlistItems]);

  return (
    <div className="wishlist-page">
      <h1 className="wishlist-heading">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <table className="wishlist-table">
          <thead>
            <tr>
              <th></th>
              <th>Product Info</th>
              <th>Price</th>
              <th>Stock Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                <p>Your wishlist is currently empty.</p>
                <button
                  className="continue-shopping-button"
                  onClick={() => navigate("/")}
                >
                  Continue Shopping
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <table className="wishlist-table">
          <thead>
            <tr>
              <th></th>
              <th>Product Info</th>
              <th>Price</th>
              <th>Stock Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {wishlistItems.map((item) => (
              <tr key={item.id}>
                <td className="delete-cell">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="delete-button"
                  >
                    ×
                  </button>
                </td>
                <td className="product-info-cell">
                  <div className="product-info">
                    <Link to={`/product/${item.product}`}>
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="cover-image"
                      />
                    </Link>
                    <span className="product-name">{item.product_name}</span>
                  </div>
                </td>
                <td>{item.product_price}</td>
                <td>{item.stock_status}</td>
                <td className="add-to-cart-cell">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="add-to-cart-button"
                  >
                    <img
                      src="/icons/cart.png"
                      alt="Add to Cart"
                      className="cart-icon"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WishlistPage;
