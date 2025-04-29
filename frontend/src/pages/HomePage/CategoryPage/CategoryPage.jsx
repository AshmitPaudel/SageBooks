import React from "react";
import { useParams } from "react-router-dom";
import BookList from "../../../components/BookList/BookList";

const endpointMap = {
  "new-arrivals": "new-arrivals",
  "best-sellers": "best-sellers",
  "books-you-might-like": "recommendations",
  "all-books": "all-books",
};

const CategoryPage = () => {
  const { category } = useParams();

  const endpoint = endpointMap[category];
  if (!endpoint) {
    return <p>Invalid category</p>;
  }

  const dataSource = `http://127.0.0.1:8000/api/home/${endpoint}/`;
  const title = category.replace(/-/g, " ");

  return <BookList title={title} dataSource={dataSource} />;
};

export default CategoryPage;
