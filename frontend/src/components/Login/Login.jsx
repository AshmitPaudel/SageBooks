import React from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import useLogin from "../../hooks/useLogin";

const Login = ({ role, onLoginSuccess }) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    errors,
    loading,
    apiError,
    handleSubmit,
  } = useLogin(role, onLoginSuccess);

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>{role === "admin" ? "Admin Login" : "Login"}</h1>
        <div className="login-heading-divider"></div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={errors.email ? "input-field error" : "input-field"}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password" className="label">
            Password
          </label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className={errors.password ? "input-field error" : "input-field"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img
              src={
                showPassword
                  ? "/icons/eye-solid.svg"
                  : "/icons/eye-slash-solid.svg"
              }
              alt="Toggle Password Visibility"
              className="password-icon"
              onClick={togglePasswordVisibility}
            />
          </div>
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        {apiError && <div className="api-error">{apiError}</div>}

        <button type="submit" className="login-button" disabled={loading}>
          {loading
            ? "Logging in..."
            : role === "admin"
            ? "Admin Login"
            : "Login"}
        </button>

        {role !== "admin" && (
          <div className="login-signup-link">
            Don't have an account?{" "}
            <Link to="/signup" className="link">
              Sign up!
            </Link>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
