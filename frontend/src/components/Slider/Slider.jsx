import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./Slider.css";
import "swiper/css/bundle";
import { Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import axios from "axios";

// Banner Slider 
export const BannerSlider = () => (
  <Swiper
    spaceBetween={10}
    autoplay={{ delay: 4000, disableOnInteraction: false }}
    loop={true}
    pagination={{ type: "bullets", clickable: true }}
    modules={[Pagination, Autoplay]}
    className="banner-slider"
  >
    {[
      "sliderimage1.jpg",
      "sliderImage2.jpg",
      "sliderimage3.jpg",
      "sliderimage4.jpg",
    ].map((img, index) => (
      <SwiperSlide key={index}>
        <img
          src={`/images/Slider/${img}`}
          alt={`Banner ${index + 1}`}
          onError={(e) => (e.target.src = "/images/default-banner-image.jpg")}
        />
      </SwiperSlide>
    ))}
  </Swiper>
);

// Book Slider 
export const BookSlider = ({ books }) => (
  <Swiper
    slidesPerView={4}
    spaceBetween={20}
    grabCursor={true}
    modules={[Pagination]}
    className="book-slider"
  >
    {books.map((book, index) => (
      <SwiperSlide key={index}>
        <Link to={`/product/${book.product_id}`} className="image-container-1">
          <img
            src={book.image}
            alt={book.name}
            onError={(e) => (e.target.src = "/images/default-book-image.jpg")}
          />
          <div className="book-info-container">
            <div className="book-name">{book.name}</div>
            <div className="book-author">By {book.author}</div>
            <div className="book-price">Rs. {book.price}</div>
          </div>
        </Link>
      </SwiperSlide>
    ))}
  </Swiper>
);

// Genre Slider 
export const GenreSlider = () => {
  const [genres, setGenres] = useState([]);

  const placeholderIcon = "/icons/Genres/book.png";

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/home/meta-info/?type=genres")
      .then(({ data }) => {
        const genreList = data.genres || [];
        const genreData = genreList.map((genre) => ({
          name: genre,
          src: `/icons/Genres/${genre.toLowerCase()}.png`,
          placeholderSrc: placeholderIcon,
        }));
        setGenres(genreData);
      })
      .catch((err) => {
        console.error("Error fetching genres:", err);
      });
  }, []);

  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={5}
      loop={true}
      breakpoints={{
        320: { slidesPerView: 2 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 5 },
      }}
      className="genre-slider"
    >
      {genres.map(({ name, src, placeholderSrc }) => (
        <SwiperSlide key={name}>
          <Link
            to={`/filter-results?genre=${encodeURIComponent(name)}`}
            className="genre-item"
          >
            <img
              src={src}
              alt={name}
              onError={(e) => (e.target.src = placeholderSrc)}
            />
            <p>{name}</p>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

// Popular Authors 
export const PopularAuthorsSlider = () => {
  const [authors, setAuthors] = useState([]);

  const placeholderIcon = "/images/placeholder.png";

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/home/meta-info/?type=authors")
      .then(({ data }) => {
        const authorList = data.authors || [];

        const limitedAuthors = authorList.slice(0, 6);

        const authorData = limitedAuthors.map((author) => ({
          name: author,
          imgSrc: `/images/Authers/${author.replace(/ /g, "")}.jpg`,
          placeholderSrc: placeholderIcon,
        }));

        setAuthors(authorData);
      })
      .catch((err) => {
        console.error("Error fetching authors:", err);
      });
  }, []);

  return (
    <Swiper
      spaceBetween={16}
      slidesPerView={4}
      loop={true}
      breakpoints={{
        320: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }}
      className="popular-authors-slider"
    >
      {authors.map(({ name, imgSrc, placeholderSrc }) => (
        <SwiperSlide key={name}>
          <Link
            to={`/filter-results?author=${encodeURIComponent(name)}`}
            className="author-item"
          >
            <img
              src={imgSrc}
              alt={name}
              onError={(e) => (e.target.src = placeholderSrc)}
            />
            <p>{name}</p>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

// Top Publishers 
export const TopPublishersSlider = () => {
  const publishers = [
    { img: "HarperCollins", name: "Harper Collins" },
    { img: "Doubleday", name: "Doubleday" },
    { img: "Penguin", name: "Penguin Classics" },
    { img: "Harper&Brothers", name: "Harper & Brothers" },
    { img: "Little,BrownandCompany", name: "Little Brown" },
  ];

  return (
    <Swiper
      spaceBetween={16}
      slidesPerView={4}
      loop={true}
      breakpoints={{
        320: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }}
      className="top-publishers-slider"
    >
      {publishers.map(({ img, name }, index) => (
        <SwiperSlide key={index}>
          <Link
            to={`/filter-results?publisher=${encodeURIComponent(img)}`}
            className="publisher-item"
          >
            <img src={`/images/Publications/${img}.png`} alt={name} />
            <p>{name}</p>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
