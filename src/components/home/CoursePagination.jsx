export default function CoursePagination({ currentPage, totalPages, onPrev, onNext, onSelectPage }) {
    if (totalPages <= 1) return null;

    const visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="mt-8 flex items-center justify-center gap-1.5 lg:justify-end">
            <button onClick={onPrev} disabled={currentPage === 1} className="flex h-10 w-10 items-center justify-center rounded border-0 bg-[#F4F5FA] text-slate-600 disabled:opacity-50">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {visiblePages.map((page) => (
                <button
                    key={page}
                    onClick={() => onSelectPage(page)}
                    className={`h-10 w-10 rounded text-sm font-medium ${page === currentPage ? "bg-brand-secondary text-white" : "bg-transparent text-slate-600"}`}
                >
                    {page}
                </button>
            ))}

            <button onClick={onNext} disabled={currentPage === totalPages} className="flex h-10 w-10 items-center justify-center rounded border-0 bg-[#F4F5FA] text-slate-600 disabled:opacity-50">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}
