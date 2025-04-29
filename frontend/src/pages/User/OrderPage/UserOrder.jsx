import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "./UserOrder.css";
import { useAuth } from "../../../context/AuthContext";
import Review from "../../Ratings&Reviews/Review";
import PaymentCheckout from "../../CheckoutPage/PaymentCheckout";
import useNotificationToast from "../../../components/NotificationToast/NotificationToast";

const BASE_URL = "http://127.0.0.1:8000";
const FILTERS = ["To Pay", "All Orders", "To Review"];

const UserOrder = () => {
  const { userId } = useAuth();
  const token = localStorage.getItem("token");

  const [orderItems, setOrderItems] = useState([]);
  const [statusChoices, setStatusChoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All Orders");
  const [showReviewOverlay, setShowReviewOverlay] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const notify = useNotificationToast();

  const authHeaders = useMemo(
    () => ({
      headers: { Authorization: `Token ${token}` },
    }),
    [token]
  );

  // Fetching orders
  useEffect(() => {
    if (!userId || !token) {
      console.error("Missing user ID or token.");
      return;
    }

    const fetchOrdersAndStatuses = async () => {
      try {
        const [ordersRes, statusRes] = await Promise.all([
          fetch(`${BASE_URL}/api/orders/user/${userId}`, authHeaders),
          fetch(`${BASE_URL}/api/order-status-choices/`),
        ]);

        const ordersData = await ordersRes.json();
        const statusData = await statusRes.json();
        const choices = Array.isArray(statusData)
          ? statusData.map((choice) => choice.value ?? choice)
          : [];

        const reviewedMap = {};

        const checkReviewStatus = async (productId) => {
          if (reviewedMap[productId] !== undefined)
            return reviewedMap[productId];
          try {
            const res = await fetch(
              `${BASE_URL}/api/reviews/check/${productId}`,
              authHeaders
            );
            const data = await res.json();
            reviewedMap[productId] = data.reviewed;
            return data.reviewed;
          } catch (e) {
            console.error(`Error checking review for product ${productId}`, e);
            return false;
          }
        };

        const formatted = await Promise.all(
          ordersData.flatMap((order) =>
            order.order_items.map(async (item) => {
              const reviewed = await checkReviewStatus(item.product);
              return {
                ...item,
                id: item.order_item_id,
                name: item.product_name,
                price: `Rs ${item.total_price}`,
                orderStatus: order.order_status,
                coverImage: `${BASE_URL}${item.product_image}`,
                orderId: order.order_id,
                reviewed,
              };
            })
          )
        );

        setOrderItems(formatted);
        setStatusChoices(choices);
      } catch (error) {
        console.error("Error fetching orders or status choices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndStatuses();
  }, [userId, token, authHeaders]);

  // update order
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${BASE_URL}/api/order/${orderId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ order_status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update order.");

      setOrderItems((prev) =>
        prev.map((item) =>
          item.orderId === orderId ? { ...item, orderStatus: newStatus } : item
        )
      );

      notify({
        message: "Order cancelled successfully.",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      notify({
        message: "Failed to cancel order.",
        type: "error",
      });
    }
  };

   // Filtered order 
  const filteredItems = useMemo(() => {
    switch (filter) {
      case "To Pay":
        return orderItems.filter((item) => item.orderStatus === "Pending");
      case "To Review":
        return orderItems.filter(
          (item) => item.orderStatus === "Delivered" && !item.reviewed
        );
      default:
        return orderItems;
    }
  }, [filter, orderItems]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort(
      (a, b) =>
        statusChoices.indexOf(a.orderStatus) -
        statusChoices.indexOf(b.orderStatus)
    );
  }, [filteredItems, statusChoices]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="user-order-page">
      <div className="user-sidebar">
        <div className="user-sidebar-content">
          <h2 className="sidebar-heading">My Orders</h2>
          <hr className="sidebar-divider" />
          <div className="sidebar-links">
            {FILTERS.map((category) => (
              <button
                key={category}
                className={`sidebar-link ${
                  filter === category ? "active" : ""
                }`}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="user-order-container">
        <h1 className="order-heading">{filter}</h1>
        <table className="order-table">
          <thead>
            <tr>
              <th></th>
              <th>Order Details</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Order Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => {
                const canCancel =
                  item.orderStatus === "Pending" && filter === "To Pay";
                const canPay = canCancel && filter === "To Pay";
                const canReview =
                  item.orderStatus === "Delivered" &&
                  filter === "To Review" &&
                  !item.reviewed;

                return (
                  <tr key={item.id}>
                    <td>
                      {canCancel && (
                        <button
                          onClick={() =>
                            updateOrderStatus(item.orderId, "Cancelled")
                          }
                          className="delete-button"
                        >
                          ×
                        </button>
                      )}
                    </td>
                    <td>
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
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                    <td>{item.orderStatus}</td>
                    <td>
                      {canPay && (
                        <button
                          onClick={() => setSelectedOrderId(item.orderId)}
                          className="pay-now-button"
                        >
                          Pay Now
                        </button>
                      )}
                      {canReview && (
                        <button
                          onClick={() => {
                            setShowReviewOverlay(item.product);
                          }}
                          className="review-now-button"
                        >
                          Review Now
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  <p>No Orders Yet</p>
                  <Link to="/" className="continue-shopping-button">
                    Continue Shopping
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOrderId && <PaymentCheckout orderId={selectedOrderId} />}

      {showReviewOverlay && (
        <Review
          productId={showReviewOverlay}
          onClose={() => setShowReviewOverlay(false)}
        />
      )}
    </div>
  );
};

export default UserOrder;
