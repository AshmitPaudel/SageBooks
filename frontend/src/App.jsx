// React Imports
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedUserRoute from "./components/ProtectedUserRoute";
// Global CSS
import "./App.css";

// Header and Footer Components
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

// User Pages
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import WishlistPage from "./pages/WishlistPage/WishlistPage";
import CartPage from "./pages/CartPage/CartPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import ProductDetailPage from "./pages/ProductPage/ProductDetailPage/ProductDetailPage";
import CategoryPage from "./pages/HomePage/CategoryPage/CategoryPage";

// fitler
import SearchResults from "./pages/SearchResults/SearchResults";
import FilterResults from "./pages/FilterResultsPage/FilterResults";

// User Account and Orders Pages
import AccountPage from "./pages/User/AccountPage/UserAccount";
import UserOrder from "./pages/User/OrderPage/UserOrder";

// Admin Pages
import ManageUsers from "./pages/Admin/ManageUsers/ManageUsers";
import ManageOrders from "./pages/Admin/ManageOrder/ManageOrders";
import ManageBooks from "./pages/Admin/ManageBooks/ManageBooks";
import AdminPage from "./pages/Admin/AdminPage/AdminPage";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";

// toast notification
import { ToastContainer } from "react-toastify";
// Import AuthContext and AuthProvider
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Wrap app with AuthProvider */}
      <Router>
        <div className="App">
          {/* Toast Container */}
          <ToastContainer />
          {/* Header Component */}
          <Header />

          {/* Routes Section */}
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/cart" element={<CartPage />} />

            {/* Protected Checkout Route */}
            <Route
              path="/checkout"
              element={
                <ProtectedUserRoute>
                  <CheckoutPage />
                </ProtectedUserRoute>
              }
            />
            <Route
              path="/product/:product_id"
              element={<ProductDetailPage />}
            />
            <Route path="/category/:category" element={<CategoryPage />} />

            <Route path="/account" element={<AccountPage />} />
            <Route path="/orders" element={<UserOrder />} />

            <Route path="/filter-results" element={<FilterResults />} />
            <Route path="/search/" element={<SearchResults />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminPage />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/manage-users"
              element={
                <ProtectedAdminRoute>
                  <ManageUsers />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/manage-orders"
              element={
                <ProtectedAdminRoute>
                  <ManageOrders />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/manage-books"
              element={
                <ProtectedAdminRoute>
                  <ManageBooks />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
          </Routes>

          {/* Footer Component */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
