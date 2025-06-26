import React from "react";
import styles from "./Pagination.module.scss";

const Pagination = ({
  currentPage,
  totalEvents,
  eventsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalEvents / eventsPerPage);

  // Don't show pagination if there's only one page or no events
  if (totalPages <= 1) return null;

  const scrollToTop = () => {
    const topElement = document.getElementById("top");
    if (topElement) {
      topElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePageClick = (pageNumber) => {
    onPageChange(pageNumber);
    scrollToTop();
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7; // Show up to 7 page numbers

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 4) {
        // Show first 5 pages + ellipsis + last page
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Show first page + ellipsis + last 5 pages
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first + ellipsis + current-1, current, current+1 + ellipsis + last
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={styles.pagination}>
      <div className={styles.paginationInfo}>
        Showing {(currentPage - 1) * eventsPerPage + 1} -{" "}
        {Math.min(currentPage * eventsPerPage, totalEvents)} of {totalEvents}{" "}
        events
      </div>

      <div className={styles.paginationControls}>
        {/* Previous button */}
        <button
          className={`${styles.pageButton} ${
            currentPage === 1 ? styles.disabled : ""
          }`}
          onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹ Previous
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              className={`${styles.pageButton} ${
                currentPage === page ? styles.active : ""
              }`}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </button>
          );
        })}

        {/* Next button */}
        <button
          className={`${styles.pageButton} ${
            currentPage === totalPages ? styles.disabled : ""
          }`}
          onClick={() =>
            currentPage < totalPages && handlePageClick(currentPage + 1)
          }
          disabled={currentPage === totalPages}
        >
          Next ›
        </button>
      </div>
    </div>
  );
};

export default Pagination;
