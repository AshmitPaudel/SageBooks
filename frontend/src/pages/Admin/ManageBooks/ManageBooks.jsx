import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/SideBar/SideBar";
import axios from "axios";
import "./ManageBooks.css";
import BookUpdate from "../../../components/BookUpdate/BookUpdate";
import useNotificationToast from "../../../components/NotificationToast/NotificationToast";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const notify = useNotificationToast();

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/manage-books/"
      );
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAdd = () => {
    setCurrentBook(null);
    setIsOverlayVisible(true);
  };

  const handleEdit = (id) => {
    const bookToEdit = books.find((book) => book.product_id === id);
    setCurrentBook(bookToEdit);
    setIsOverlayVisible(true);
  };

  const closeOverlay = () => {
    setIsOverlayVisible(false);
    setCurrentBook(null);
    fetchBooks();
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/delete-book/${productId}/delete/`
      );
      fetchBooks();

      notify({
        message: "Book deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting book:", error);

      notify({
        message: "Failed to delete the book.",
        type: "error",
      });
    }
  };
  return (
    <div className="manage-books-page">
      <div className="books-dashboard">
        <Sidebar />
        <main className="manage-books-content">
          <h1 className="manage-books-heading">Manage Books</h1>
          <button onClick={handleAdd} className="add-button">
            <img src="/icons/add.png" alt="Add" className="add-icon" />
            Add
          </button>
          <h2 className="book-list-heading">Book List</h2>
          <table className="books-table">
            <thead>
              <tr>
                <th></th>
                <th>Book ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Publisher</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.product_id}>
                  {" "}
                  <td className="delete-cell">
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(book.product_id)}
                    >
                      ×
                    </button>{" "}
                  </td>
                  <td>{book.product_id.slice(0, 8)}</td>{" "}
                  <td>{book.product_name}</td>
                  <td>{book.author_name}</td>
                  <td>{book.genre}</td>
                  <td>{book.publisher}</td>
                  <td className="action-cell">
                    <button
                      onClick={() => handleEdit(book.product_id)}
                      className="edit-button"
                    >
                      <img
                        src="/icons/edit.png"
                        alt="Edit"
                        className="edit-icon"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
      
      {isOverlayVisible && (
        <BookUpdate closeOverlay={closeOverlay} bookData={currentBook} />
      )}
    </div>
  );
};

export default ManageBooks;
