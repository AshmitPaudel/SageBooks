import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CheckoutPage.css";
import { CheckoutValidations } from "../../components/Validations/CheckoutValidations";
import { useAuth } from "../../context/AuthContext";
import CheckoutForm from "./CheckoutForm";
import { useLocation, useNavigate } from "react-router-dom";
import useNotificationToast from "../../components/NotificationToast/NotificationToast";

const CheckoutPage = () => {
  const { userId } = useAuth();
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();
  const notify = useNotificationToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    landmark: "",
    paymentMethod: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [productDetails, setProductDetails] = useState(null);

  const isCheckoutFromCart = location.state?.fromCart;
  const isCheckoutFromProduct = location.state?.fromProduct;
  const productId = location.state?.product_id;
  const quantity = location.state?.quantity || 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const paymentRes = await axios.get(
          "http://127.0.0.1:8000/api/payment-methods/"
        );
        setPaymentMethods(paymentRes.data.available_payment_methods);

        if (isCheckoutFromCart && userId) {
          const cartRes = await axios.get(
            `http://127.0.0.1:8000/api/cart/user/${userId}/`
          );
          setCartItems(cartRes.data);
        }

        if (isCheckoutFromProduct && productId) {
          const productRes = await axios.get(
            `http://127.0.0.1:8000/api/manage-books/${productId}/`
          );
          setProductDetails(productRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId, isCheckoutFromCart, isCheckoutFromProduct, productId]);

  const handleChange = ({ target: { name, type, value, checked } }) => {
    const updatedValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
      ...(type === "radio" && { paymentMethod: value }),
    }));
  };

  const handleBlur = ({ target: { name, value } }) => {
    const validationError = CheckoutValidations.validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: validationError,
    }));
  };

  const computedSubtotal = isCheckoutFromCart
    ? cartItems.reduce(
        (acc, item) => acc + parseFloat(item.product_price) * item.quantity,
        0
      )
    : productDetails
    ? parseFloat(productDetails.price) * quantity
    : 0;

  const shippingAmount = 0.0;
  const computedTotal = computedSubtotal + shippingAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = CheckoutValidations.validateCheckoutForm(formData);
    if (Object.values(validationErrors).some(Boolean)) {
      setErrors(validationErrors);
      return;
    }

    const orderPayload = {
      order_items: isCheckoutFromCart
        ? cartItems.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
          }))
        : isCheckoutFromProduct && productDetails
        ? [{ product_id: productId, quantity: quantity }]
        : [],
    };

    try {
      await axios.post("http://127.0.0.1:8000/api/checkout/", orderPayload, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      notify({
        message: "Order placed successfully!",
        type: "success",
      });
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error);
      notify({
        message: "Error placing order. Please try again later.",
        type: "error",
      });
    }
  };

  const handleLinkClick = (e) => e.preventDefault();

  return (
    <div className="checkout-page">
      <h1 className="checkout-heading">Checkout</h1>
      <CheckoutForm
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleSubmit={handleSubmit}
        paymentMethods={paymentMethods}
        shippingAmount={shippingAmount}
        subtotal={computedSubtotal}
        total={computedTotal.toFixed(2)}
        handleLinkClick={handleLinkClick}
      />
    </div>
  );
};

export default CheckoutPage;
