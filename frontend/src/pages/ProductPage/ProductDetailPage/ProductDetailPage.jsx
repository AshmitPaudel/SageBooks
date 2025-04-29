import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import "./ProductDetailPage.css";
import RatingsAndReviews from "../../Ratings&Reviews/Ratings&Reviews";
import ImageOverlay from "../../../components/ImageOverlay/ImageOverlay";
import LoginOverlay from "../../../components/Login/LoginOverlay";
import Rating from "@mui/material/Rating";
import useNotificationToast from "../../../components/NotificationToast/NotificationToast";


const WishlistIcon = ({ isActive, onClick }) => (
  <div className="wishlist-container" onClick={onClick}>
    <img
      src={isActive ? "/icons/redheart.png" : "/icons/heart.png"}
      alt="Wishlist Icon"
      className="wishlist-icon"
    />
  </div>
);

const ProductImage = ({ imageSrc, onClick, onError }) => (
  <div className="product-image-section">
    <img
      src={imageSrc}
      alt="Book Cover"
      className="product-image"
      onClick={onClick}
      onError={onError}
    />
  </div>
);

const ProductDetailPage = () => {
  const { isAuthenticated } = useAuth();
  const { product_id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isWishlistActive, setIsWishlistActive] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showLoginOverlay, setShowLoginOverlay] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const notify = useNotificationToast();
  const [loginRedirectInfo, setLoginRedirectInfo] = useState({
    destination: "/",
    shouldRedirect: false,
  });

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/manage-books/${product_id}/`
        );
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/reviews/product/${product_id}`
        );
        const reviewData = await response.json();
        setReviews(reviewData);

        const reviewsCount = reviewData.length;
        const avgRating =
          reviewsCount > 0
            ? reviewData.reduce((acc, review) => acc + review.rating, 0) /
              reviewsCount
            : 0;
        setAverageRating(avgRating);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (product_id) {
      fetchProductDetails();
      fetchReviews();
    }
  }, [product_id]);

  const handleError = () => setImageError(true);
  const handleImageClick = () => setShowOverlay(true);
  const closeOverlay = () => setShowOverlay(false);

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Number(e.target.value) || 1);
    setQuantity(
      value > product.stock_quantity ? product.stock_quantity : value
    );
  };

  const promptLoginIfNeeded = (destination, shouldRedirect = false) => {
    if (!isAuthenticated) {
      setLoginRedirectInfo({ destination, shouldRedirect });
      setShowLoginOverlay(true);
      return true;
    }
    return false;
  };

  const handleBuyNow = () => {
    if (promptLoginIfNeeded("/", false)) return;

    notify({ message: "Proceeding to checkout...", type: "info" });

    setTimeout(() => {
      navigate("/checkout", {
        state: {
          fromProduct: true,
          product_id: product_id,
          quantity: quantity,
        },
      });
    }, 1500);
  };

  const handleAddToWishlist = async () => {
    if (promptLoginIfNeeded("/wishlist", false)) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("User is not authenticated");

      const data = { product_id };
      const response = await axios.post(
        "http://127.0.0.1:8000/api/wishlist/add/",
        data,
        { headers: { Authorization: `Token ${token}` } }
      );

      setIsWishlistActive(true);
      notify({ message: "Added to wishlist!", type: "success" });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      notify({ message: "Failed to add to wishlist.", type: "error" });
    }
  };

  const handleAddToCart = async () => {
    if (promptLoginIfNeeded("/cart", false)) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("User is not authenticated");

      const data = { product_id, quantity };
      const response = await axios.post(
        "http://127.0.0.1:8000/api/cart/add/",
        data,
        { headers: { Authorization: `Token ${token}` } }
      );

      console.log("Item added to cart:", response.data);
      notify({ message: "Added to cart!", type: "success" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      notify({ message: "Failed to add to cart.", type: "error" });
    }
  };

  if (!product) return <div>Loading...</div>;

  const imageSrc = imageError
    ? "/images/fallback-image.jpg"
    : `http://127.0.0.1:8000${product.product_image}`;

  return (
    <div className="product-detail-page">
      <div className="main-container">
        <div className="secondary-section">
          <ProductImage
            imageSrc={imageSrc}
            onClick={handleImageClick}
            onError={handleError}
          />

          <WishlistIcon
            isActive={isWishlistActive}
            onClick={handleAddToWishlist}
          />

          <div className="book-details-container">
            <h3>Book Details</h3>
            <table className="book-details-table">
              <tbody>
                <tr>
                  <td>
                    <strong>Genre:</strong>
                  </td>
                  <td>{product.genre}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Publisher:</strong>
                  </td>
                  <td>{product.publisher}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Format:</strong>
                  </td>
                  <td>{product.format}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Pages:</strong>
                  </td>
                  <td>{product.pages}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="product-details-container">
          <div className="product-info-section">
            <h1 className="product-title">{product.product_name}</h1>
            <p className="product-author">By: {product.author_name}</p>

            <div className="product-rating">
              <Rating
                name="read-only"
                value={averageRating || 0}
                readOnly
                precision={0.1}
              />
              <span className="review-count">
                ({reviews.length > 0 ? reviews.length : 0} Reviews)
              </span>
            </div>

            <p className="product-stock">
              In Stock:{" "}
              <span className="stock-count">{product.stock_quantity}</span> left
            </p>

            <hr className="stock-description-divider" />

            <div className="product-description">
              <h3>Description</h3>
              <div className="description-text">{product.book_description}</div>
            </div>

            <hr className="description-divider" />

            <p className="product-price">Rs {product.price}</p>

            <div className="purchase-actions">
              <div className="quantity-selector">
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  className="quantity-input"
                />
              </div>
              <button
                className="action-btn add-to-cart-btn"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <button className="action-btn buy-now-btn" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="ratings-and-review-container-1">
        <RatingsAndReviews productId={product_id} />
      </div>

      <ImageOverlay
        showOverlay={showOverlay}
        onClose={closeOverlay}
        imageSrc={`http://127.0.0.1:8000${product.product_image}`}
      />
      {showLoginOverlay && (
        <LoginOverlay
          isOpen={showLoginOverlay}
          onClose={() => setShowLoginOverlay(false)}
          destination={loginRedirectInfo.destination}
          shouldRedirect={loginRedirectInfo.shouldRedirect}
        />
      )}
      
    </div>
  );
};

export default ProductDetailPage;
