import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") ? true : false;
  const userRole = localStorage.getItem("role");

  if (!isAuthenticated || userRole !== "admin") {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default ProtectedAdminRoute;
