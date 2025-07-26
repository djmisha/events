import React from "react";

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
    <div className="flex flex-col items-center gap-5 my-10 p-8 py-8 px-4 bg-gray-50 rounded-lg border border-gray-300 shadow-md">
      <div className="text-base text-black text-center font-medium opacity-80">
        Showing {(currentPage - 1) * eventsPerPage + 1} -{" "}
        {Math.min(currentPage * eventsPerPage, totalEvents)} of {totalEvents}{" "}
        events
      </div>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        {/* Previous button - only show if not on first page */}
        {currentPage > 1 && (
          <button
            className="py-3 px-4 md:py-4 md:px-5 border-2 border-gray-300 bg-white text-black rounded-lg text-base font-medium cursor-pointer transition-all duration-200 min-w-[52px] md:min-w-[60px] hover:bg-gray-50 hover:-translate-y-px hover:shadow-md active:translate-y-0 active:shadow-sm"
            onClick={() => handlePageClick(currentPage - 1)}
          >
            ‹ Previous
          </button>
        )}

        {/* Page numbers */}
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="py-3 px-4 md:py-4 md:px-5 min-w-[52px] md:min-w-[60px] flex items-center justify-center text-gray-400 text-base font-medium m-0"
              >
                ...
              </span>
            );
          }

          // Always render page numbers with the same style, including 1 and last
          return (
            <button
              key={page}
              className={`py-3 px-4 md:py-4 md:px-5 border-2 ${
                currentPage === page
                  ? "bg-pink text-white border-pink font-semibold shadow-md hover:bg-pink-600 hover:border-pink-600 hover:-translate-y-px"
                  : "border-gray-300 bg-white text-black hover:bg-gray-50 hover:-translate-y-px hover:shadow-md"
              } rounded-lg text-base font-medium cursor-pointer transition-all duration-200 min-w-[52px] md:min-w-[60px] active:translate-y-0 active:shadow-sm`}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </button>
          );
        })}

        {/* Next button - only show if not on last page */}
        {currentPage < totalPages && (
          <button
            className="py-3 px-4 md:py-4 md:px-5 border-2 border-gray-300 bg-white text-black rounded-lg text-base font-medium cursor-pointer transition-all duration-200 min-w-[52px] md:min-w-[60px] hover:bg-gray-50 hover:-translate-y-px hover:shadow-md active:translate-y-0 active:shadow-sm"
            onClick={() => handlePageClick(currentPage + 1)}
          >
            Next ›
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
