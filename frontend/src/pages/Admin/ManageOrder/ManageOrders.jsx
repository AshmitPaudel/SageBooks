import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/SideBar/SideBar";
import axios from "axios";
import "./ManageOrders.css";
import useNotificationToast from "../../../components/NotificationToast/NotificationToast";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusChoices, setStatusChoices] = useState([]);
  const notify = useNotificationToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("http://127.0.0.1:8000/api/orders/");
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStatusChoices = async () => {
      try {
        const { data } = await axios.get(
          "http://127.0.0.1:8000/api/order-status-choices/"
        );
        setStatusChoices(data);
      } catch (error) {
        console.error("Error fetching status choices:", error);
      }
    };

    fetchOrders();
    fetchStatusChoices();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const { data } = await axios.put(
        `http://127.0.0.1:8000/api/order/${orderId}/`,
        {
          order_status: newStatus,
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId
            ? { ...order, order_status: newStatus }
            : order
        )
      );

      notify({
        message: data.message || "Order status updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating order status:", error);

      notify({
        message: "Failed to update order status.",
        type: "error",
      });
    }
  };

  const sortedOrders = orders.slice().sort((a, b) => {
    const statusOrder = statusChoices.map((choice) => choice.value);
    return (
      statusOrder.indexOf(a.order_status) - statusOrder.indexOf(b.order_status)
    );
  });

  return (
    <div className="manage-orders-page">
      <div className="orders-dashboard">
        <Sidebar />
        <main className="manage-orders-content">
          <h1 className="manage-orders-heading">Manage Orders</h1>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id.slice(0, 8)}</td>
                  <td>{order.username}</td>
                  <td>{order.email}</td>
                  <td>{order.order_status}</td>
                  <td>
                    {order.order_status !== "Cancelled" &&
                    order.order_status !== "Delivered" ? (
                      <select
                        value={order.order_status}
                        onChange={(e) =>
                          updateStatus(order.order_id, e.target.value)
                        }
                        className="status-dropdown"
                      >
                        {statusChoices.map((choice) => (
                          <option key={choice.value} value={choice.value}>
                            {choice.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="status-disabled">
                        {order.order_status === "Delivered"
                          ? "Delivered"
                          : "Cancelled"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default ManageOrders;
