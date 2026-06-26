export default function CourseControls({ sortBy, setSortBy, searchQuery, setSearchQuery, mobile = false }) {
    const wrapperClass = mobile ? "mb-4 flex gap-3 lg:hidden" : "mb-6 hidden lg:ml-auto lg:flex lg:w-full lg:max-w-[46%] lg:gap-4";
    const sortWrapClass = mobile ? "relative w-1/2" : "min-w-0 flex-1";
    const searchWrapClass = mobile ? "flex h-12 w-1/2 items-center justify-between rounded-xl border border-gray-200 bg-white px-[17px] py-[13px]" : "flex h-12 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-[17px] py-[13px]";

    return (
        <div className={wrapperClass}>
            <div className={sortWrapClass}>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-white px-[17px] py-[13px] pr-10 text-base font-medium leading-[140%] tracking-[0.2px] text-slate-600 outline-none [font-family:'DM_Sans',sans-serif]"
                >
                    <option>Urutkan</option>
                    <option>Terbaru</option>
                    <option>Terpopuler</option>
                    <option>Rating Tertinggi</option>
                    <option>Harga Terendah</option>
                    <option>Harga Tertinggi</option>
                </select>
                <svg className="pointer-events-none absolute right-[17px] top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            <div className={mobile ? searchWrapClass : "w-[220px]"}>
                <div className={mobile ? "contents" : searchWrapClass}>
                    <input
                        type="text"
                        placeholder="Cari Kelas"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border-0 p-0 text-base font-medium leading-[140%] tracking-[0.2px] text-slate-600 outline-none placeholder:text-slate-600 [font-family:'DM_Sans',sans-serif]"
                    />
                    <svg className="ml-3 h-5 w-5 flex-shrink-0 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
