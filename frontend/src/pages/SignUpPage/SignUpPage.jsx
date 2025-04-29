import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUpPage.css";
import { SignUpValidations } from "../../components/Validations/SignUpValidations";
import axios from "axios";
import useNotificationToast from "../../components/NotificationToast/NotificationToast";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({});
  const notify = useNotificationToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    const validationErrors = SignUpValidations.validateForm(
      formData.username,
      formData.email,
      formData.password
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...validationErrors }));
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (response.data?.token) {
        localStorage.setItem("authToken", response.data.token);
        notify({
          message: "Registration successful!",
          type: "success",
          autoClose: 2000,
        });

        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "Unexpected response from server. Please try again.",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
      }));
    }
  };

  const renderError = (field) =>
    errors[field] && <p className="error-message">{errors[field]}</p>;

  return (
    <div className="signup-page">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <hr className="heading-divider" />
        <div className="form-group">
          <label htmlFor="username" className="label">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`input-field ${errors.username ? "input-error" : ""}`}
            placeholder="Enter your username"
            required
          />
          {renderError("username")}
        </div>
        <div className="form-group">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`input-field ${errors.email ? "input-error" : ""}`}
            placeholder="Enter your email"
            required
          />
          {renderError("email")}
        </div>
        <div className="form-group">
          <label htmlFor="password" className="label">
            Password
          </label>
          <div className="password-wrapper">
            <input
              type={passwordVisibility.password ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`input-field password-field ${
                errors.password ? "input-error" : ""
              }`}
              placeholder="Enter your password"
              required
            />
            <img
              src={
                passwordVisibility.password
                  ? "/icons/eye-solid.svg"
                  : "/icons/eye-slash-solid.svg"
              }
              alt="Toggle Password Visibility"
              className="password-icon"
              onClick={() => togglePasswordVisibility("password")}
            />
          </div>
          {renderError("password")}
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword" className="label">
            Confirm Password
          </label>
          <div className="password-wrapper">
            <input
              type={passwordVisibility.confirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`input-field password-field ${
                errors.confirmPassword ? "input-error" : ""
              }`}
              placeholder="Confirm your password"
              required
            />
            <img
              src={
                passwordVisibility.confirmPassword
                  ? "/icons/eye-solid.svg"
                  : "/icons/eye-slash-solid.svg"
              }
              alt="Toggle Confirm Password Visibility"
              className="password-icon"
              onClick={() => togglePasswordVisibility("confirmPassword")}
            />
          </div>
          {renderError("confirmPassword")}
        </div>

        {errors.general && <p className="error-message">{errors.general}</p>}

        <button type="submit" className="signup-button">
          Sign Up
        </button>

        <div className="signin-link">
          Already have an account?{" "}
          <Link to="/login" className="link">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
