import React from "react";
import { useNavigate } from "react-router-dom";
import Login from "../../components/Login/Login";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate("/");
  };

  return (
    <div>
      <Login role="user" onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default LoginPage;
