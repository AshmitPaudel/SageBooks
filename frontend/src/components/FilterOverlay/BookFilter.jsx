import React, { useEffect, useState } from "react";
import "./BookFilter.css";
import axios from "axios";
import FilterDropdown from "./FilterDropdown";
import { useNavigate } from "react-router-dom";

const BookFilter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [shouldRenderOverlay, setShouldRenderOverlay] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    genre: null,
    author: null,
    publisher: null,
    sort_by: null,
  });

  const [options, setOptions] = useState({
    genres: [],
    authors: [],
    publishers: [],
    sort_by: [
      { value: "recent", label: "Recently Added" },
      { value: "oldest", label: "Oldest" },
      { value: "price_low_high", label: "Price: Low to High" },
      { value: "price_high_low", label: "Price: High to Low" },
      { value: "pages_low_high", label: "Pages: Low to High" },
      { value: "pages_high_low", label: "Pages: High to Low" },
    ],
  });

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/home/meta-info/?type=genres")
      .then(({ data }) => {
        setOptions({
          genres: data.genres.map((value) => ({ value, label: value })),
        });
      })
      .catch((err) => console.error("Error fetching genres:", err));

    axios
      .get("http://127.0.0.1:8000/api/home/meta-info/?type=authors")
      .then(({ data }) => {
        setOptions((prevOptions) => ({
          ...prevOptions,
          authors: data.authors.map((value) => ({ value, label: value })),
        }));
      })
      .catch((err) => console.error("Error fetching authors:", err));

    axios
      .get("http://127.0.0.1:8000/api/home/meta-info/?type=publishers")
      .then(({ data }) => {
        setOptions((prevOptions) => ({
          ...prevOptions,
          publishers: data.publishers.map((value) => ({
            value,
            label: value,
          })),
        }));
      })
      .catch((err) => console.error("Error fetching publishers:", err));
  }, []);

  useEffect(() => {
    if (overlayVisible) {
      setShouldRenderOverlay(true);
    } else {
      const timeout = setTimeout(() => setShouldRenderOverlay(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [overlayVisible]);

  const toggleOverlay = () => {
    setOverlayVisible((prev) => !prev);
    setHasEntered(false);
  };

  const handleApply = () => {
    console.log("Filters applied:", filters);
    setOverlayVisible(false);
    setHasEntered(false);

    const queryParams = new URLSearchParams();
    if (filters.genre) queryParams.append("genre", filters.genre.value);
    if (filters.author) queryParams.append("author", filters.author.value);
    if (filters.publisher)
      queryParams.append("publisher", filters.publisher.value);
    if (filters.sort_by) queryParams.append("sort_by", filters.sort_by.value);
    const filterUrl = `/filter-results${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;

    navigate(filterUrl);
  };

  const handleClear = () => {
    setFilters({
      genre: null,
      author: null,
      publisher: null,
      sort_by: null,
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?search=${searchTerm}`);
  };

  return (
    <>
      <div className="filter-button-1">
        <button
          className={`filter-btn ${overlayVisible ? "open" : ""}`}
          onClick={toggleOverlay}
        >
          Filter
          <img src="/icons/filter1.png" alt="Filter" className="filter-icon" />
        </button>
      </div>

      {shouldRenderOverlay && (
        <div className={`filter-overlay ${overlayVisible ? "visible" : ""}`}>
          <div
            className="filter-container"
            onMouseEnter={() => setHasEntered(true)}
            onMouseLeave={() =>
              hasEntered && (setOverlayVisible(false), setHasEntered(false))
            }
          >
            <div className="filter-search-wrapper">
              <form
                className="filter-search-container"
                onSubmit={handleSearchSubmit}
              >
                <input
                  type="text"
                  className="search-bar"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="search-btn">
                  <img
                    src="/icons/magnifying-glass.png"
                    alt="Search"
                    className="search-icon"
                  />
                </button>
              </form>
            </div>

            <div className="filter-inner-content">
              <FilterDropdown
                selectedPrice={filters.price}
                onPriceChange={(val) =>
                  setFilters((f) => ({ ...f, price: val }))
                }
                selectedGenre={filters.genre}
                onGenreChange={(val) =>
                  setFilters((f) => ({ ...f, genre: val }))
                }
                selectedAuthor={filters.author}
                onAuthorChange={(val) =>
                  setFilters((f) => ({ ...f, author: val }))
                }
                selectedPublisher={filters.publisher}
                onPublisherChange={(val) =>
                  setFilters((f) => ({ ...f, publisher: val }))
                }
                selectedSortBy={filters.sort_by}
                onSortByChange={(val) =>
                  setFilters((f) => ({ ...f, sort_by: val }))
                }
                genreOptions={options.genres}
                authorOptions={options.authors}
                publisherOptions={options.publishers}
              />
            </div>

            <div className="filter-actions">
              <button className="apply-btn" onClick={handleApply}>
                Apply
              </button>
              <button className="clear-btn" onClick={handleClear}>
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookFilter;
