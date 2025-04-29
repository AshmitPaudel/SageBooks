const BookValidations = {
  validateBookForm: (fields) => {
    let errors = {};

    Object.keys(fields).forEach((key) => {
      if (typeof fields[key] === "string") {
        fields[key] = fields[key].trim();
      }
    });

    //  Book Image Validation
    if (fields.image) {
      const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxFileSize = 5 * 1024 * 1024;

      if (!allowedFileTypes.includes(fields.image.type)) {
        errors.image = "Only JPG, JPEG, and PNG formats are allowed.";
      } else if (fields.image.size > maxFileSize) {
        errors.image = "File size must not exceed 5MB.";
      }
    }

    //  Title Validation
    if (fields.title) {
      if (fields.title.length === 0) {
        errors.title = "Title cannot be empty.";
      } else if (!/^[A-Za-z0-9\s.:'-]+$/.test(fields.title)) {
        errors.title =
          "Title can only contain letters, numbers, spaces, '.', ':', and '-'.";
      } else if (fields.title.length < 3) {
        errors.title = "Title must be at least 3 characters long.";
      }
    }

    //  Publisher Validation
    if (fields.publisher) {
      if (fields.publisher.length === 0) {
        errors.publisher = "Publisher cannot be empty.";
      } else if (!/^[A-Za-z0-9\s.&/'-]+$/.test(fields.publisher)) {
        errors.publisher =
          "Publisher name can only contain letters, numbers, spaces, '.', '&', '/', apostrophes, and hyphens.";
      } else if (fields.publisher.length < 3) {
        errors.publisher = "Publisher name must be at least 3 characters long.";
      }
    }

    //  Description Validation
    if (fields.description) {
      fields.description = fields.description.trim();
      if (!/^[A-Za-z0-9.,!?'\s-]+$/.test(fields.description)) {
        errors.description =
          "Description can only contain letters, numbers, spaces, and basic punctuation (.,!?'-).";
      } else if (fields.description.length < 50) {
        errors.description = "Description must be at least 50 characters long.";
      } else if (fields.description.length > 1000) {
        errors.description = "Description cannot exceed 1000 characters.";
      }
    }

    //  Pages Validation
    if (fields.pages !== undefined && fields.pages !== "") {
      if (!/^\d+$/.test(fields.pages) || Number(fields.pages) <= 0) {
        errors.pages = "Pages must be a positive whole number.";
      }
    }

    //  Stock Quantity Validation
    if (fields.stock !== undefined && fields.stock !== "") {
      if (!/^\d+$/.test(fields.stock) || Number(fields.stock) < 0) {
        errors.stock = "Stock quantity must be a non-negative whole number.";
      }
    }

    //  Price Validation
    if (fields.price !== undefined && fields.price !== "") {
      const priceValue = parseFloat(fields.price);
      if (isNaN(priceValue) || priceValue <= 0) {
        errors.price = "Price must be a positive number.";
      }
    }

    return errors;
  },
};

export default BookValidations;
