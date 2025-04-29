import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import {
  BookSlider,
  BannerSlider,
  GenreSlider,
  PopularAuthorsSlider,
  TopPublishersSlider,
} from "../../components/Slider/Slider";
import "swiper/css/bundle";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("new-arrivals");
  const [booksData, setBooksData] = useState({
    "new-arrivals": [],
    "best-sellers": [],
    "books-you-might-like": [],
  });
  const navigate = useNavigate();

  const baseUrl = "http://127.0.0.1:8000";

  useEffect(() => {
    Promise.all([
      fetch(`${baseUrl}/api/home/new-arrivals/`).then((res) => res.json()),
      fetch(`${baseUrl}/api/home/best-sellers/`).then((res) => res.json()),
      fetch(`${baseUrl}/api/home/recommendations/`).then((res) => res.json()),
    ])
      .then(([newArrivalsData, bestSellersData, recommendedData]) => {
        const updatedBooksData = {
          "new-arrivals": newArrivalsData.new_arrivals.map((book) => ({
            ...book,
            image: `${baseUrl}${book.product_image}`,
            name: book.product_name,
            author: book.author_name,
            price: book.price,
          })),
          "best-sellers": bestSellersData.best_sellers.map((book) => ({
            ...book,
            image: `${baseUrl}${book.product_image}`,
            name: book.product_name,
            author: book.author_name,
            price: book.price,
          })),
          "books-you-might-like": recommendedData.books_you_might_like.map(
            (book) => ({
              ...book,
              image: `${baseUrl}${book.product_image}`,
              name: book.product_name,
              author: book.author_name,
              price: book.price,
            })
          ),
        };

        localStorage.setItem(
          "booksData",
          JSON.stringify({
            "best-sellers": updatedBooksData["best-sellers"],
            "books-you-might-like": updatedBooksData["books-you-might-like"],
          })
        );

        setBooksData(updatedBooksData);
      })
      .catch((error) => console.error("Error fetching home page data:", error));
  }, []);

  return (
    <div className="home-page">
      <div className="banner">
        <BannerSlider />
      </div>

      <div className="hp-main-container">
        <div className="genres">
          <div className="heading-container">
            <h2>Popular Genres</h2>
          </div>
          <GenreSlider />
        </div>

        {/* Explore Section */}
        <div className="explore">
          <div className="explore-top-container">
            <h2>Explore</h2>
            <div className="explore-buttons">
              <button onClick={() => setSelectedCategory("new-arrivals")}>
                new arrivals
              </button>
              <button onClick={() => setSelectedCategory("best-sellers")}>
                best sellers
              </button>
              <button
                onClick={() => setSelectedCategory("books-you-might-like")}
              >
                recommended
              </button>
            </div>
            <hr className="explore-divider" />
          </div>

          <div className="explore-bottom-container">
            {selectedCategory === "new-arrivals" && (
              <div className="new-arrivals">
                <div className="heading-container">
                  <h2>New Arrivals</h2>
                </div>
                <BookSlider books={booksData["new-arrivals"]} />
                <button
                  className="explore-all-btn"
                  onClick={() => navigate("/category/new-arrivals")}
                >
                  explore all
                </button>
              </div>
            )}

            {selectedCategory === "best-sellers" && (
              <div className="best-sellers">
                <div className="heading-container">
                  <h2>Best Sellers</h2>
                </div>
                <BookSlider books={booksData["best-sellers"]} />
                <button
                  className="explore-all-btn"
                  onClick={() => navigate("/category/best-sellers")}
                >
                  explore all
                </button>
              </div>
            )}

            {selectedCategory === "books-you-might-like" && (
              <div className="books-you-might-like">
                <div className="heading-container">
                  <h2>Books You Might Like</h2>
                </div>
                <BookSlider books={booksData["books-you-might-like"]} />
                <button
                  className="explore-all-btn"
                  onClick={() => navigate("/category/books-you-might-like")}
                >
                  explore all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Popular Authors */}
        <div className="popular-authors">
          <div className="heading-container">
            <h2>Popular Authors</h2>
          </div>
          <div className="popular-authors-items-display">
            <PopularAuthorsSlider />
          </div>
        </div>

        {/* publisher */}
        <div className="top-publishers">
          <div className="heading-container">
            <h2>Top Publishers</h2>
          </div>
          <div className="top-publishers-items-display">
            <TopPublishersSlider />
          </div>
        </div>

        {/* What We Offer */}
        <div className="what-we-offer">
          <div className="heading-container">
            <h2>What We Offer</h2>
          </div>
          <div className="what-we-offer-items-display">
            {[
              { img: "shipping", text: "Free Shipping" },
              { img: "return", text: "Easy Returns" },
              { img: "genuine", text: "Genuine Product" },
              { img: "support", text: "24/7 Support" },
            ].map(({ img, text }, index) => (
              <div className="offer-item" key={index}>
                <img src={`/images/WhatWeOffer/${img}.svg`} alt={text} />
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
