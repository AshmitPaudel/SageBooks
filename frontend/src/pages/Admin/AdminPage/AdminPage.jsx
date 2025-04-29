// Admin Login

import React from "react";
import { useNavigate } from "react-router-dom";
import Login from "../../../components/Login/Login";

const AdminLoginPage = () => {
  const navigate = useNavigate();

  const handleAdminLoginSuccess = (role) => {
    if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div>
      <Login role="admin" onLoginSuccess={handleAdminLoginSuccess} />
    </div>
  );
};

export default AdminLoginPage;
