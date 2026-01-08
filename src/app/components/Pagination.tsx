import React from "react";

interface PaginationProps {
    currentPage: number;                     // Current active page
    totalPages: number;                      // Total number of pages
    itemsPerPage: number;                    // Page size (items per page)
    totalItems: number;                      // Total number of items in dataset
    onPageChange: (page: number) => void;    // Handler for changing page
    onItemsPerPageChange: (itemsPerPage: number) => void; // Handler for changing page size
    pageSizeOptions?: number[];              // Dropdown options for page size
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    onPageChange,
    onItemsPerPageChange,
    pageSizeOptions = [10, 15, 25, 50]
}) => {

    // Calculate start and end indexes for the "Showing X–Y of Z items" text
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    return (
        <div className="px-6 py-4 border-t flex items-center justify-between">

            {/* LEFT SIDE: Pagination buttons */}
            <div className="flex items-center gap-2">

                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                {/* Page Number Buttons with Ellipsis */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                        (page) =>
                            page === 1 ||                          // Always show first page
                            page === totalPages ||                 // Always show last page
                            Math.abs(page - currentPage) <= 1      // Show pages close to current
                    )
                    .map((page, i, arr) => {
                        const prevPage = arr[i - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;

                        return (
                            <React.Fragment key={page}>

                                {/* Dots (...) if gap between pages */}
                                {showEllipsis && (
                                    <span className="px-2 text-gray-400">...</span>
                                )}

                                {/* Page Button */}
                                <button
                                    onClick={() => onPageChange(page)}
                                    className={`px-3 py-1 border rounded-md ${
                                        currentPage === page
                                            ? "bg-[#008ca8] text-white"      // Active page style
                                            : "hover:bg-gray-50"             // Hover style
                                    }`}
                                >
                                    {page}
                                </button>
                            </React.Fragment>
                        );
                    })}

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages || totalItems === 0}
                    className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>

            {/* CENTER: Items per page dropdown */}
            <div className="flex flex-1 justify-center">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show</span>

                    {/* Dropdown for page size */}
                    <select
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        className="px-2 py-1 border rounded-md"
                    >
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>

                    <span className="text-sm text-gray-600">items</span>
                </div>
            </div>

            {/* RIGHT SIDE: Showing X–Y of Z items */}
            <div>
                <span className="text-sm text-gray-600">
                    {totalItems === 0
                        ? "0 items"
                        : `${startIndex + 1}-${Math.min(endIndex, totalItems)} of ${totalItems} items`}
                </span>
            </div>
        </div>
    );
};

export default Pagination;
