import React, { useState } from "react";
import "./SearchOverlay.css";
import { useNavigate } from "react-router-dom";
import SearchValidations from "../Validations/SearchValidations";

const SearchOverlay = ({ isOpen, closeOverlay }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    setShowError(false);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const validationError = SearchValidations.validateSearchTerm(searchTerm);
    if (validationError) {
      setSearchError(validationError);
      setShowError(true);
      return;
    }

    navigate(`/search?search=${searchTerm}`);
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    closeOverlay();
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="search-overlay">
      <div className="overlay" onClick={handleOverlayClick}>
        <div className="overlay-content" onClick={handleContentClick}>
          <form className="search-container" onSubmit={handleSearchSubmit}>
            <div className="input-wrapper">
              <input
                type="text"
                className={`search-bar ${
                  showError && searchError ? "input-error" : ""
                }`}
                placeholder="Search for products..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {showError && searchError && (
                <p className="error-message">{searchError}</p>
              )}
            </div>
            <button
              type="submit"
              className="search-btn"
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
