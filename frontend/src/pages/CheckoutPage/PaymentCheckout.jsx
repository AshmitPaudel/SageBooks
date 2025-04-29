import React, { useEffect, useState } from "react";

const PaymentCheckout = ({ orderId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [customerInfo, setCustomerInfo] = useState(null);

  const userId = localStorage.getItem("user_id");

  const productPriceNPR = products.reduce((acc, curr) => {
    return acc + parseFloat(curr.total_price || 0);
  }, 0);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}`);
        const data = await response.json();
        const mappedProducts = data.order_items.map((item) => ({
          order_item_id: item.order_item_id,
          product_name: item.product_name,
          product_price: item.product_price,
          quantity: item.quantity,
          total_price: item.total_price,
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("Failed to fetch order details.");
      }
    };

    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/manage-users/${userId}/`);
        const data = await response.json();
        setCustomerInfo({
          name: data.username,
          email: data.email,
          phone: data.phone_number,
        });
      } catch (err) {
        setError("Failed to fetch user info.");
      }
    };

    if (userId) fetchUserInfo();
    if (orderId) fetchOrderDetails();
  }, [orderId, userId]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pidx = urlParams.get("pidx");
    if (pidx) {
      setSuccessMessage(`Payment successful! Transaction ID: ${pidx}`);
    }
  }, []);

  useEffect(() => {
    if (customerInfo && products.length > 0 && !loading && !successMessage) {
      handleCheckout();
    }
  }, [customerInfo, products]);

  const handleCheckout = async () => {
    if (!customerInfo) {
      setError("Customer info not loaded.");
      return;
    }

    const amountInPaisa = productPriceNPR * 100;

    const productDetails = products.map((product) => ({
      identity: product.order_item_id,
      name: product.product_name,
      total_price: parseFloat(product.total_price) * 100,
      quantity: product.quantity,
      unit_price: parseFloat(product.product_price) * 100,
    }));

    const paymentData = {
      return_url: "http://localhost:3000/orders",
      website_url: "http://localhost:3000/",
      amount: amountInPaisa,
      purchase_order_id: orderId,
      purchase_order_name: `Order ${orderId.slice(0, 8)}`,
      customer_info: customerInfo,
      amount_breakdown: [{ label: "Mark Price", amount: amountInPaisa }],
      product_details: productDetails,
    };

    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://dev.khalti.com/api/v2/epayment/initiate/", {
        method: "POST",
        headers: {
          Authorization: "Key 4b5f21d2671145709a2b7609b6e58c24",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = data.payment_url;
      } else {
        setError(data.error_key || "Unknown error");
      }
    } catch (error) {
      setError("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-checkout">
 
      {successMessage && <p>{successMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default PaymentCheckout;
