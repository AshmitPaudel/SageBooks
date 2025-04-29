import React, { useState, useRef, useEffect, useCallback } from "react";
import "./Review.css";
import { RatingsAndReviewsValidations } from "../../components/Validations/Ratings&ReviewsValidation";
import Rating from "@mui/material/Rating";
import { useNavigate } from "react-router-dom"; 

const Review = ({ productId, onClose }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);
  const navigate = useNavigate(); 

  const handleSubmit = async () => {
    setSubmitted(true);
    const validationErrors = RatingsAndReviewsValidations.validateForm(
      rating,
      review
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/reviews/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          product: productId,
          rating,
          comment: review,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setReview("");
        setRating(0);
        setErrors({});
        setSubmitted(false);

        navigate(`/product/${productId}`);
        if (onClose) onClose(); 
      } else {
        setErrors(responseData);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOutsideClick = useCallback(
    (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        if (onClose) onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  return (
    <div className="review-overlay">
      <div className="review" ref={containerRef}>
        <div className="leave-review-container">
          <h3>Leave a Review</h3>

          <div className="rating-input">
            <label>Your Rating:</label>
            <Rating
              name="user-rating"
              value={rating}
              precision={1}
              onChange={(event, newValue) => {
                if (newValue !== null) setRating(newValue);
              }}
            />
            {submitted && errors.rating && (
              <p className="error-text">{errors.rating}</p>
            )}
          </div>

          <div className="review-input">
            <label>Your Review:</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className={submitted && errors.review ? "error" : ""}
              placeholder="Enter your review..."
              rows={5}
            />
            {submitted && errors.review && (
              <p className="error-text">{errors.review}</p>
            )}
          </div>

          <button
            className="review-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;
