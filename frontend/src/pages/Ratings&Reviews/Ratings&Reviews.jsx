import React, { useState, useEffect } from "react";
import "./Ratings&Reviews.css";
import Rating from "@mui/material/Rating";
import axios from "axios";

const ReviewItem = ({ review }) => (
  <div className="review-item">
    <Rating value={review.rating} readOnly precision={0.1} size="medium" />
    <p className="user-comment">{review.comment}</p>{" "}
    <div className="user-info">
      <div className="user-name-date">
        <span className="user-name">{review.username}</span> -{" "}
        <span className="review-date">
          {new Date(review.review_date).toLocaleDateString()}
        </span>
      </div>
      <span className="user-email">{review.email}</span>
    </div>
  </div>
);

const RatingAndReviewContainer = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/reviews/product/${productId}`
        );

        const reviewData = response.data;
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

    if (productId) fetchReviews();
  }, [productId]);

  const reviewsCount = reviews.length;

  return (
    <div className="ratings-and-review-container">
      <div className="see-review-container">
        <div className="ratings-header">
          <h3>Ratings & Reviews</h3>
          <p>
            {reviewsCount} {reviewsCount === 1 ? "Review" : "0 Reviews"}
          </p>
        </div>

        {/* Display overall rating */}
        <div className="rating-display">
          <p className="overall-rating">{averageRating.toFixed(1)}</p>
          <Rating
            value={averageRating}
            readOnly
            precision={0.1}
            sx={{ fontSize: "2rem" }}
          />
        </div>

        <hr className="divider" />

        {/* Reviews Section */}
        <div className="reviews-list">
          {reviewsCount > 0 ? (
            reviews.map((review, index) => (
              <div key={index}>
                <ReviewItem review={review} />
                {index < reviewsCount - 1 && <hr className="review-divider" />}
              </div>
            ))
          ) : (
            <p className="user-comment no-reviews">No reviews yet.</p>
          )}

          {reviewsCount > 0 && <hr className="review-divider-last" />}
        </div>
      </div>
    </div>
  );
};

const RatingsAndReviews = ({ productId }) => (
  <div className="rating-review">
    <div className="ratings-and-review-container-1">
      <h2>Ratings & Reviews</h2>
      <RatingAndReviewContainer productId={productId} />
    </div>
  </div>
);

export default RatingsAndReviews;
