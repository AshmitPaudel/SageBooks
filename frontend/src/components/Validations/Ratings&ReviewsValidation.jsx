// RatingsAndReviewsValidation.jsx

const validateRating = (rating) => {
    return rating > 0;
  };
  
  const validateReviewText = (review) => {
    return review.trim().length > 0;
  };
  
  const validateReviewLength = (review) => {
    const maxReviewLength = 400;
    return review.length <= maxReviewLength;
  };
  
  const validateForm = (rating, review) => {
    let errors = {};
  
    if (!validateRating(rating)) {
      errors.rating = "Please provide a rating.";
    }
  
    if (!validateReviewText(review)) {
      errors.review = "Please enter a review.";
    }
  
    if (!validateReviewLength(review)) {
      errors.review = `Review cannot exceed 400 characters.`;
    }
  
    return errors;
  };
  
  export const RatingsAndReviewsValidations = {
    validateRating,
    validateReviewText,
    validateReviewLength,
    validateForm,
  };
  