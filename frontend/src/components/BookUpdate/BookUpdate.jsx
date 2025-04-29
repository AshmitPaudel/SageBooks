import React, { useState, useMemo, useRef } from "react";
import useBookUpdate from "./useBookUpdate";
import "./BookUpdate.css";
import ImageOverlay from "../ImageOverlay/ImageOverlay";

const FormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = true,
  error,
  options = [],
}) => (
  <div className="form-group">
    <label>{label}:</label>
    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={error ? "input-error" : "book-input"}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`book-input ${error ? "input-error" : ""}`}
      />
    )}
    {error && <p className="error-message">{error}</p>}
  </div>
);

const BookUpdate = ({ closeOverlay, bookData: initialBookData }) => {
  const {
    bookData,
    customErrors,
    handleInputChange,
    handleFileChange,
    handleClear,
    handleSubmit,
  } = useBookUpdate(initialBookData);

  const [showOverlay, setShowOverlay] = useState(false);
  const fileInputRef = useRef(null);

  const genreOptions = useMemo(
    () =>
      [
        "Adventure",
        "Romance",
        "Fantasy",
        "Mystery",
        "Thriller",
        "Fiction",
        "Poetry",
        "Psychology",
        "Horror",
        "Philosophy",
      ].sort(),
    []
  );

  const formatOptions = useMemo(() => ["Hardcover", "Paperback"], []);

  const imagePreviewUrl = useMemo(() => {
    if (bookData.image instanceof File) {
      return URL.createObjectURL(bookData.image);
    } else if (typeof bookData.image === "string") {
      return bookData.image;
    }
    return null;
  }, [bookData.image]);

  const formFields = useMemo(
    () => [
      { label: "Title", name: "title", placeholder: "Enter book title" },
      {
        label: "Author Name",
        name: "author",
        placeholder: "Enter author's name",
      },
      { label: "Genre", name: "genre", type: "select", options: genreOptions },
      {
        label: "Publisher",
        name: "publisher",
        placeholder: "Enter publisher name",
      },
      {
        label: "Description",
        name: "description",
        placeholder: "Write a short description of the book",
      },
      {
        label: "Format",
        name: "format",
        type: "select",
        options: formatOptions,
      },
      {
        label: "Pages",
        name: "pages",
        type: "number",
        min: 1,
        placeholder: "Enter number of pages",
      },
      {
        label: "Stock Quantity",
        name: "stock",
        type: "number",
        min: 0,
        placeholder: "Enter available stock quantity",
      },
      {
        label: "Price",
        name: "price",
        type: "number",
        min: 0,
        step: 0.01,
        placeholder: "Enter price (e.g., 10.99)",
      },
    ],
    [genreOptions, formatOptions]
  );

  return (
    <div className="book-update-container" onClick={closeOverlay}>
      <div className="book-update-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="book-update-heading">
          {initialBookData ? "Update a Book" : "Add a Book"}
        </h2>
        <form
          onSubmit={(e) => handleSubmit(e, closeOverlay)}
          className="book-form"
          noValidate
        >
          {/* Book Image Upload */}
          <div className="form-group">
            <label>Book Image:</label>
            <div className="file-upload-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              {customErrors.image && (
                <p className="error-message">{customErrors.image}</p>
              )}
              {imagePreviewUrl && (
                <div
                  className="image-preview"
                  onClick={() => setShowOverlay(true)}
                >
                  <img
                    src={imagePreviewUrl}
                    alt="Book preview"
                    className="cover-image"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          {formFields.map((field) => (
            <FormField
              key={field.name}
              {...field}
              value={bookData[field.name]}
              onChange={handleInputChange}
              error={customErrors[field.name]}
            />
          ))}

          <div className="button-container">
            <button type="submit" className="submit-button">
              {initialBookData ? "Update Book" : "Save Book"}
            </button>
            <button
              type="button"
              className="clear-button"
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              type="button"
              className="close-button"
              onClick={closeOverlay}
            >
              Close
            </button>
          </div>
        </form>
      </div>

      <ImageOverlay
        showOverlay={showOverlay}
        onClose={() => setShowOverlay(false)}
        imageSrc={imagePreviewUrl || "/images/default-image.jpg"}
      />
    </div>
  );
};

export default BookUpdate;
