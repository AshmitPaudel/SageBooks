import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedUserRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") ? true : false;
  const location = useLocation();
  const fromCart = location.state?.fromCart;
  const fromProduct = location.state?.fromProduct;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!location.state || (!fromCart && !fromProduct)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedUserRoute;
