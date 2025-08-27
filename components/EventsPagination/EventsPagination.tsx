import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface EventsPaginationProps {
  currentPage: number;
  totalEvents: number;
  eventsPerPage: number;
  onPageChange: (pageNumber: number) => void;
}

const EventsPagination: React.FC<EventsPaginationProps> = ({
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

  const handlePageClick = (pageNumber: number) => {
    onPageChange(pageNumber);
    scrollToTop();
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
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

  const startEvent = (currentPage - 1) * eventsPerPage + 1;
  const endEvent = Math.min(currentPage * eventsPerPage, totalEvents);

  return (
    <div className="flex flex-col items-center gap-4 mt-8 mb-6">
      {/* Events count display */}
      <div className="text-sm text-gray-600 text-center font-medium">
        Showing {startEvent} - {endEvent} of {totalEvents} events
      </div>

      {/* Pagination controls */}
      <Pagination>
        <PaginationContent>
          {/* Previous button */}
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageClick(currentPage - 1)}
                className="cursor-pointer"
              />
            </PaginationItem>
          )}

          {/* Page numbers */}
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageClick(page as number)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {/* Next button */}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageClick(currentPage + 1)}
                className="cursor-pointer"
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default EventsPagination;
