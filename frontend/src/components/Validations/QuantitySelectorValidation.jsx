// QuantitySelectorValidation.jsx
const QuantitySelectorValidation = {
  validateQuantity: (quantity, maxStock) => {
    let errors = {};

    if (quantity < 1) {
      errors.quantity = "Quantity must be at least 1.";
    }

    if (quantity > maxStock) {
      errors.quantity = `Quantity cannot exceed the available stock of ${maxStock}.`;
    }

    return errors;
  },
};

export default QuantitySelectorValidation;
