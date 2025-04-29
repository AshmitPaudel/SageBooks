import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import SearchOverlay from "../../components/SearchOverlay/SearchOverlay";
import Logout from "../Logout";
import { useAuth } from "../../context/AuthContext";
import LoginOverlay from "../Login/LoginOverlay";

function Header() {
  const [isLoginOverlayOpen, setIsLoginOverlayOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBooksDropdownVisible, setIsBooksDropdownVisible] = useState(false);
  const [isAccountDropdownVisible, setIsAccountDropdownVisible] =
    useState(false);

  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const handleSearchClick = () => setIsSearchOpen(true);
  const closeSearchOverlay = () => setIsSearchOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAccountDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBooksMouseEnter = () => {
    clearTimeout(closeTimeoutRef.current);
    setIsBooksDropdownVisible(true);
  };

  const handleBooksMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsBooksDropdownVisible(false);
    }, 200);
  };

  const handleAccountMouseEnter = () => {
    clearTimeout(closeTimeoutRef.current);
    setIsAccountDropdownVisible(true);
  };

  const handleAccountMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsAccountDropdownVisible(false);
    }, 200);
  };

  const handleAccountClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  };

  return (
    <>
      <header className="header">
        <Link to="/" className="logo-link">
          <img src="/icons/logo3.png" alt="Logo" className="logo" />
        </Link>

        {/* Books Hover Button */}
        <div
          className="books-dropdown-wrapper"
          onMouseEnter={handleBooksMouseEnter}
          onMouseLeave={handleBooksMouseLeave}
        >
          <button className="books-btn">
            Books
            <img
              src="/icons/down.png"
              alt="Dropdown Icon"
              className={`dropdown-icon ${
                isBooksDropdownVisible ? "rotated" : ""
              }`}
            />
          </button>
        </div>

        {/* Nav section */}
        <nav className="nav">
          <ul className="nav-links"></ul>

          <div className="nav-icons">
            <button
              type="button"
              className="search-btn"
              onClick={handleSearchClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
                src={
                  isHovered
                    ? "/icons/magnifying-glass-1.png"
                    : "/icons/magnifying-glass.png"
                }
                alt="Search"
                className="search-icon"
              />
            </button>

            {/* Account Dropdown */}
            <div
              className="account-dropdown"
              ref={dropdownRef}
              onMouseEnter={handleAccountMouseEnter}
              onMouseLeave={handleAccountMouseLeave}
            >
              <button
                type="button"
                className="account-btn"
                onClick={handleAccountClick}
              >
                <img
                  src="/icons/account.png"
                  alt="Account"
                  className="account-icon"
                />
              </button>

              {isAccountDropdownVisible && isAuthenticated && (
                <div className="dropdown-menu">
                  <Link to="/account" className="dropdown-item">
                    Account
                  </Link>
                  <Link to="/orders" className="dropdown-item">
                    Orders
                  </Link>
                  <Link to="/wishlist" className="dropdown-item">
                    Wishlist
                  </Link>
                  <div className="dropdown-item-logout">
                    <Logout redirectTo="/" className="logout-btn">
                      Log Out
                    </Logout>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              className="cart-btn"
              onClick={() => {
                if (isAuthenticated) {
                  navigate("/cart");
                } else {
                  setIsLoginOverlayOpen(true);
                }
              }}
            >
              <img src="/icons/cart.png" alt="Cart" className="cart-icon" />
            </button>
          </div>
        </nav>
      </header>

      {/* Books Dropdown */}
      {isBooksDropdownVisible && (
        <div
          className="books-dropdown"
          onMouseEnter={handleBooksMouseEnter}
          onMouseLeave={handleBooksMouseLeave}
        >
          <div className="books-dropdown-content">
            <div className="books-links-column">
              <Link to="/category/all-books" className="books-link">
                All Books
              </Link>
              <Link to="category/new-arrivals" className="books-link">
                New Arrivals
              </Link>
              <Link to="/category/best-sellers" className="books-link">
                Best Sellers
              </Link>
              <Link to="/category/books-you-might-like" className="books-link">
                Books You Might Like
              </Link>
            </div>
          </div>
        </div>
      )}

      <SearchOverlay isOpen={isSearchOpen} closeOverlay={closeSearchOverlay} />

      <LoginOverlay
        isOpen={isLoginOverlayOpen}
        onClose={() => setIsLoginOverlayOpen(false)}
        destination="/cart"
      />
    </>
  );
}

export default Header;
