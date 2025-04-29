import React from "react";
import Pagination from "@mui/material/Pagination";

const BookPagination = ({ totalPages, currentPage, onPageChange }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
      }}
    >
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={onPageChange}
        color="primary"
        variant="outlined"
        shape="rounded"
      />
    </div>
  );
};

export default BookPagination;
