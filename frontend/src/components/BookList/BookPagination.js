import React from "react";
import Pagination from "@mui/material/Pagination";

const BookPagination = ({ totalPages, page, handlePageChange }) => {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
    >
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        sx={{
          "& .MuiPaginationItem-root": {
            color: "white",
            backgroundColor: "#333",
            "&.Mui-selected": {
              backgroundColor: "#555",
              color: "white",
            },
            "&:hover": {
              backgroundColor: "#444",
            },
          },
        }}
      />
    </div>
  );
};

export default BookPagination;
