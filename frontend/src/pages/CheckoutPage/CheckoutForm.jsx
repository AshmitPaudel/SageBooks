import React from "react";

const CheckoutForm = ({
  formData,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
  paymentMethods,
  shippingAmount,
  subtotal,
  total,
  handleLinkClick,
}) => {
  const renderInput = (
    id,
    label,
    type = "text",
    placeholder = "",
    required = false
  ) => (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={id}
        value={formData[id]}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={errors[id] ? "input-error" : ""}
        required={required}
      />
      {errors[id] && <span className="error">{errors[id]}</span>}
    </div>
  );

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <div className="checkout-section">
        <h2>Billing & Shipping</h2>
        {renderInput("name", "Full Name", "text", "Enter your full name", true)}
        {renderInput("email", "Email", "email", "Enter your email", true)}
        {renderInput(
          "phone",
          "Phone Number",
          "tel",
          "(+977) Enter phone number",
          true
        )}
        {renderInput("city", "City", "text", "Enter your city", true)}
        {renderInput(
          "address",
          "Address",
          "text",
          "Enter your full address",
          true
        )}
        {renderInput(
          "landmark",
          "Landmark (Optional)",
          "text",
          "e.g., Near City Center Mall"
        )}
      </div>

      <div className="checkout-summary">
        <h2>Order Summary</h2>
        <table>
          <tbody>
            <tr>
              <th>Subtotal</th>
              <td>${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <th>Shipping</th>
              <td>${shippingAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <th>Total</th>
              <td>${total}</td>
            </tr>
          </tbody>
        </table>

        <h2>Payment Method</h2>
        <div className="payment-methods">
          {paymentMethods.map((method) => (
            <label key={method.payment_method_id}>
              <input
                type="radio"
                name="paymentMethod"
                value={method.method_name}
                checked={formData.paymentMethod === method.method_name}
                onChange={handleChange}
              />
              {method.method_name}
            </label>
          ))}
        </div>
        {errors.paymentMethod && (
          <span className="error">{errors.paymentMethod}</span>
        )}

        <hr className="divider" />

        <div className="terms-conditions">
          <label>
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
            />
            I agree to the{" "}
            <span className="terms-link">
              <a href="/terms" onClick={handleLinkClick}>
                Terms and Conditions
              </a>
            </span>
          </label>
        </div>
        {errors.agreeToTerms && (
          <span className="error">{errors.agreeToTerms}</span>
        )}

        <button type="submit" className="checkout-button">
          Place Order
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
