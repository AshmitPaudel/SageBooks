import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import useNotificationToast from "../../components/NotificationToast/NotificationToast";
import "./CartPage.css";

const CartPage = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const getToken = () => localStorage.getItem("token");
  const notify = useNotificationToast();

  const fetchCartItems = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/cart/user/${userId}/`
      );
      const cartData = response.data;

      const formattedCartItems = cartData.map((item) => ({
        id: item.id,
        product: item.product_id,
        name: item.product_name,
        price: parseFloat(item.product_price),
        coverImage: `http://127.0.0.1:8000${item.product_image}`,
        quantity: item.quantity,
        stockQuantity: item.stock_quantity,
      }));

      setCartItems(formattedCartItems);
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setCartItems([]);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchCartItems();
    }
  }, [userId, fetchCartItems]);

  //  Handle delete 
  const handleDelete = async (id) => {
    const token = getToken();

    try {
      await axios.delete(`http://127.0.0.1:8000/api/cart/delete/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });

      setCartItems(cartItems.filter((item) => item.id !== id));

      notify({
        message: "Item removed from cart",
        type: "success",
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      notify({
        message: "Failed to remove item",
        type: "error",
      });
    }
  };

  // Handle wishlsit
  const handleWishlist = async (item) => {
    const token = getToken();

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/wishlist/add/",
        { product_id: item.product },
        { headers: { Authorization: `Token ${token}` } }
      );

      notify({
        message: "Item added to wishlist",
        type: "success",
      });

      await axios.delete(`http://127.0.0.1:8000/api/cart/delete/${item.id}/`, {
        headers: { Authorization: `Token ${token}` },
      });

      setCartItems(cartItems.filter((cartItem) => cartItem.id !== item.id));
    } catch (error) {
      console.error("Error moving item to wishlist:", error);
      notify({
        message: "Failed to move item to wishlist",
        type: "error",
      });
    }
  };

  // Handle quantity change
  const handleQuantityChange = async (id, newQuantity) => {
    const item = cartItems.find((cartItem) => cartItem.id === id);
    const updatedQuantity = Math.max(
      1,
      Math.min(newQuantity, item.stockQuantity)
    );

    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: updatedQuantity } : item
      )
    );

    const token = getToken();
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/cart/update/${id}/`,
        { quantity: updatedQuantity },
        { headers: { Authorization: `Token ${token}` } }
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const { subtotal, total } = useMemo(() => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    return { subtotal, total: subtotal };
  }, [cartItems]);

  // Handle checkout
  const handleCheckout = () => {
    notify({
      message: "Redirecting to checkout...",
      type: "info",
    });

    setTimeout(() => {
      navigate("/checkout", { state: { fromCart: true } });
    }, 1000);
  };

  return (
    <div className="cart-page">
      <h1 className="cart-heading">My Cart</h1>

      {cartItems.length === 0 ? (
        <table className="cart-table">
          <thead>
            <tr>
              <th></th>
              <th>Product Info</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                <p>Your cart is currently empty.</p>
                <Link to="/">
                  <button className="continue-shopping-button">
                    Continue Shopping
                  </button>
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th></th>
                <th>Product Info</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
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
                          src={item.coverImage}
                          alt={item.name}
                          className="cover-image"
                        />
                      </Link>
                      <span className="product-name">{item.name}</span>
                    </div>
                  </td>
                  <td>{`Rs ${item.price.toFixed(2)}`}</td>
                  <td className="quantity-cell">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.id,
                          parseInt(e.target.value) || 1
                        )
                      }
                      min="1"
                      max={item.stockQuantity}
                      className="quantity-input"
                    />
                  </td>
                  <td>{`Rs ${(item.price * item.quantity).toFixed(2)}`}</td>
                  <td className="wishlist-cell">
                    <button
                      onClick={() => handleWishlist(item)}
                      className="wishlist-button"
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <img
                        src={
                          hoveredItem === item.id
                            ? "/icons/redheart.png"
                            : "/icons/heart.png"
                        }
                        alt="Wishlist"
                        className="wishlist-icon"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <h2>Cart Summary</h2>
            <table className="cart-summary-table">
              <tbody>
                <tr>
                  <td className="label">Subtotal:</td>
                  <td className="amount">Rs {subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="label">Total Amount:</td>
                  <td className="amount">Rs {total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <button onClick={handleCheckout} className="checkout-button">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
