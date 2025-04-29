import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useBookUpdate = (initialBookData) => {
  const [bookData, setBookData] = useState({
    image: null,
    title: "",
    author: "",
    genre: "",
    publisher: "",
    description: "",
    format: "",
    pages: "",
    stock: "",
    price: "",
  });

  const [customErrors, setCustomErrors] = useState({});
  const fetchBookDetails = useCallback(async () => {
    if (initialBookData) {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/manage-books/${initialBookData.product_id}/`
        );
        const fetchedData = response.data;

        setBookData({
          image: fetchedData.product_image_url || null,
          title: fetchedData.product_name,
          author: fetchedData.author_name,
          genre: fetchedData.genre,
          publisher: fetchedData.publisher,
          description: fetchedData.book_description,
          format: fetchedData.format,
          pages: fetchedData.pages,
          stock: fetchedData.stock_quantity,
          price: fetchedData.price,
        });
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    }
  }, [initialBookData]);

  useEffect(() => {
    fetchBookDetails();
  }, [fetchBookDetails]);

  const handleInputChange = useCallback(({ target: { name, value } }) => {
    setBookData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback(({ target: { files } }) => {
    setBookData((prev) => ({ ...prev, image: files[0] }));
  }, []);

  const handleClear = () => {
    setBookData({
      image: null,
      title: "",
      author: "",
      genre: "",
      publisher: "",
      description: "",
      format: "",
      pages: "",
      stock: "",
      price: "",
    });
    setCustomErrors({});
  };

  const handleSubmit = async (e, closeOverlay) => {
    e.preventDefault();

    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const errors = {};
    if (Object.keys(errors).length > 0) {
      setCustomErrors(errors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("product_name", bookData.title);
      formData.append("author_name", bookData.author);
      formData.append("genre", bookData.genre);
      formData.append("publisher", bookData.publisher);
      formData.append("book_description", bookData.description);
      formData.append("format", bookData.format);
      formData.append("pages", bookData.pages);
      formData.append("stock_quantity", bookData.stock);
      formData.append("price", bookData.price);

      if (bookData.image instanceof File) {
        formData.append("product_image", bookData.image);
      }

      if (initialBookData) {
        const updateUrl = `http://127.0.0.1:8000/api/update-books/${initialBookData.product_id}/update/`;
        await axios.patch(updateUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Book updated successfully");
      } else {
        await axios.post("http://127.0.0.1:8000/api/add/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Book added successfully");
      }

      closeOverlay();
    } catch (error) {
      console.error(
        "API Error:",
        error.response?.data || error.message || "Unknown error occurred"
      );
    }
  };

  return {
    bookData,
    customErrors,
    handleInputChange,
    handleFileChange,
    handleClear,
    handleSubmit,
  };
};

export default useBookUpdate;
