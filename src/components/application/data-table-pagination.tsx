
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx";

interface DataTablePaginationProps {
  pageNumber: number; // 1-based index
  totalRecords: number | undefined;
  recordsPerPage: number | undefined;
  onChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  // Show up to 5 page numbers, with ellipsis if needed
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "ellipsis")[] = [];
  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, "ellipsis", total);
  } else if (current >= total - 3) {
    pages.push(1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(
      1,
      "ellipsis",
      current - 1,
      current,
      current + 1,
      "ellipsis",
      total
    );
  }
  return pages;
}

const DataTablePagination: React.FC<DataTablePaginationProps> = ({
  pageNumber,
  totalRecords,
  recordsPerPage,
  onChange,
}) => {

    if(!(totalRecords && recordsPerPage)) {
        return null;
    }
  const totalPages = Math.max(1, Math.ceil(totalRecords / recordsPerPage));
  const currentPage = Math.min(Math.max(pageNumber, 1), totalPages);

  const pageNumbers = getPageNumbers(currentPage, totalPages);
  
  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onChange(page);
    }
  };

  if (totalPages <= 1) {
    // No pagination needed for a single page
    return null;
  }

  return (
    <Pagination className="py-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : 0}
            onClick={e => {
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
          />
        </PaginationItem>
        {pageNumbers.map((page, idx) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                aria-current={page === currentPage ? "page" : undefined}
                onClick={e => {
                  e.preventDefault();
                  handlePageChange(page as number);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={currentPage === totalPages}
            tabIndex={currentPage === totalPages ? -1 : 0}
            onClick={e => {
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default DataTablePagination;
