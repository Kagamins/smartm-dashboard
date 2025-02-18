import { useState } from "react";

export default function AudienceList({ audience }) {
    const [hovered, setHovered] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // 5x4 grid

    // Pagination logic
    const totalPages = Math.ceil(audience.length / itemsPerPage);
    const paginatedItems = audience.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Trigger Hover */}
            <p className="hover:border px-2 py-1 cursor-pointer">عرض الجمهور</p>

            {/* Popup Container */}
            {hovered && (
                <div className="absolute left-0 top-10 bg-white shadow-lg border rounded-lg p-4  min-w-full z-50">
                    <h3 className="text-center font-semibold mb-2">الجمهور</h3>

                    {/* Grid Display */}
                    <div className="grid grid-cols-2 gap-5">
                        {paginatedItems.map((name, index) => (
                            <p key={index} className="text-center bg-gray-100 p-3 w-full rounded-md">
                                {name}
                            </p>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-3">
                            <button
                                className={`px-2 py-1 text-sm ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                السابق
                            </button>
                            <span className="text-sm">
                                صفحة {currentPage} من {totalPages}
                            </span>
                            <button
                                className={`px-2 py-1 text-sm ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                التالي
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
