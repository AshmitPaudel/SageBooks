import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./LoginOverlay.css";
import Login from "../Login/Login";

const LoginOverlay = ({ isOpen, onClose, destination = "/", shouldRedirect = true }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      onClose(); 
      if (shouldRedirect) {
        navigate(destination); 
      }
    }
  }, [isOpen, isAuthenticated, onClose, navigate, destination, shouldRedirect]);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("login-overlay")) {
      onClose(); 
    }
  };

  const handleLoginSuccess = () => {
    onClose(); 
    if (shouldRedirect) {
      navigate(destination); 
    }
  };

  if (!isOpen || isAuthenticated) return null;

  return (
    <div className="login-overlay" onClick={handleOverlayClick}>
      <div className="login-form-container">
        <Login 
          role="user" 
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </div>
  );
};

export default LoginOverlay;
