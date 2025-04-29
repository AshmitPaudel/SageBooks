import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUserId = localStorage.getItem("user_id");

    if (storedToken && storedRole && storedUserId) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
      setUserId(storedUserId);
    }
  }, []);

  // Login function to set auth state
  const login = (role, token, user_id) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserId(user_id);
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("user_id", user_id);
  };

  // Logout function to clear auth state
  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, userId, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
