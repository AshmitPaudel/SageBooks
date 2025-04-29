import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./BookList.css";
import BookFilter from "../FilterOverlay/BookFilter";
import BookPagination from "./BookPagination";

const BookList = ({ title, dataSource = "", books: booksProp = null }) => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const booksPerPage = 8;

  useEffect(() => {
    if (booksProp) {
      setBooks(booksProp);
    } else {
      const fetchBooks = async () => {
        try {
          const response = await fetch(dataSource);
          const data = await response.json();
          const booksArray = Object.values(data)[0] || [];
          const updatedBooks = booksArray.map((book) => ({
            name: book.product_name,
            author: book.author_name,
            price: parseFloat(book.price),
            image: `http://127.0.0.1:8000${book.product_image}`,
            product_id: book.product_id,
          }));
          setBooks(updatedBooks);
        } catch (error) {
          console.error("Error fetching books:", error);
          setBooks([]);
        }
      };
      fetchBooks();
    }
  }, [dataSource, booksProp]);

  const totalPages = Math.ceil(books.length / booksPerPage);
  const displayedBooks = books.slice(
    (page - 1) * booksPerPage,
    page * booksPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  return (
    <div className="booklist-outer-container">
      <div className="booklist-page">
        <h2>{title}</h2>
        <BookFilter />

        {books.length > 0 ? (
          <>
            <div className="booklist-items-display">
              {displayedBooks.map((book, index) => (
                <Link
                  to={`/product/${book.product_id}`}
                  key={index}
                  className="booklist-item"
                >
                  <img src={book.image} alt={book.name} />
                  <div className="booklist-book-info-container">
                    <div className="booklist-book-name">{book.name}</div>
                    <div className="booklist-book-author">By {book.author}</div>
                    <div className="booklist-book-price">Rs. {book.price}</div>
                  </div>
                </Link>
              ))}
            </div>
            <BookPagination
              totalPages={totalPages}
              page={page}
              handlePageChange={handlePageChange}
            />
          </>
        ) : (
          <p>No books found</p>
        )}
      </div>
    </div>
  );
};

export default BookList;
