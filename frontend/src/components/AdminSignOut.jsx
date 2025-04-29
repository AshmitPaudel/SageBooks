import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminSignOut = ({ className = "logout-button", children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/admin");
    window.location.reload();
  };

  return (
    <button onClick={handleAdminLogout} className={className}>
      {children || "Admin Logout"}
    </button>
  );
};

export default AdminSignOut;
