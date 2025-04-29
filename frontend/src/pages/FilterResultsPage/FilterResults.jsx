import React from "react";
import { useLocation } from "react-router-dom";
import BookList from "../../components/BookList/BookList";

const FilterResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const genre = queryParams.get("genre");
  const priceRange = queryParams.get("price");
  const author = queryParams.get("author");
  const publisher = queryParams.get("publisher");
  const availability = queryParams.get("available");
  const sortBy = queryParams.get("sort_by");
  const pages = queryParams.get("pages");

  console.log("genre:", genre);
  console.log("priceRange:", priceRange);
  console.log("author:", author);
  console.log("publisher:", publisher);
  console.log("availability:", availability);
  console.log("sortBy:", sortBy);
  console.log("pages:", pages);

  let dataSource = `http://127.0.0.1:8000/api/filter/`;

  const queryStrings = [];

  if (genre) queryStrings.push(`genre=${genre}`);
  if (author) queryStrings.push(`author=${author}`);
  if (publisher) queryStrings.push(`publisher=${publisher}`);
  if (sortBy) queryStrings.push(`sort_by=${sortBy}`);

  if (queryStrings.length > 0) {
    dataSource += `?${queryStrings.join("&")}`;
  }

  const title = "Filtered Results";

  return <BookList title={title} dataSource={dataSource} />;
};

export default FilterResults;
