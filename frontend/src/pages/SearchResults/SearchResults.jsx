import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Fuse from "fuse.js";
import "./SearchResults.css";
import BookList from "../../components/BookList/BookList";

const SearchResults = () => {
  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get("search");

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/home/all-books/")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.all_books);
      })
      .catch((err) => console.error("Failed to fetch books", err));
  }, []);

  // Filter using Fuse.js
  useEffect(() => {
    if (searchTerm && books.length > 0) {
      const fuse = new Fuse(books, {
        keys: ["product_name", "author_name", "genre", "publisher"],
        threshold: 0.3,
      });

      const results = fuse.search(searchTerm);
      setFilteredBooks(results.map((result) => result.item));
    } else {
      setFilteredBooks(books);
    }
  }, [searchTerm, books]);

  return (
    <div className="search-results-page">
      <BookList
        title={searchTerm ? `Search Results for "${searchTerm}"` : "All Books"}
        books={filteredBooks.map((book) => ({
          name: book.product_name,
          author: book.author_name,
          price: parseFloat(book.price),
          image: `http://127.0.0.1:8000${book.product_image}`,
          product_id: book.product_id,
        }))}
      />
    </div>
  );
};

export default SearchResults;
