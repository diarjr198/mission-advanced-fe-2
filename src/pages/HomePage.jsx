import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import HomeNavbar from "../components/layout/HomeNavbar";
import Footer from "../components/layout/Footer";
import CourseCard from "../components/ui/CourseCard";
import { categories } from "../assets/data/courses";
import { ALL_CLASSES_CATEGORY } from "../utils/course";
import bannerHero from "../assets/images/banner/banner-1.jpg";
import bannerCta from "../assets/images/banner/banner-cta.jpg";
import FilterPanel from "../components/home/FilterPanel";
import CourseControls from "../components/home/CourseControls";
import CoursePagination from "../components/home/CoursePagination";
import useCourseFilterState from "../hooks/useCourseFilterState";
import {
    fetchCourses,
    selectCourseItems,
    selectCoursesFetchError,
    selectCoursesFetchStatus,
} from "../stores/redux/courseSlice";

export default function HomePage() {
    const dispatch = useDispatch();
    const location = useLocation();
    const courseItems = useSelector(selectCourseItems);
    const fetchStatus = useSelector(selectCoursesFetchStatus);
    const fetchError = useSelector(selectCoursesFetchError);
    const [activeCategory, setActiveCategory] = useState(ALL_CLASSES_CATEGORY);
    const [showFilterMode, setShowFilterMode] = useState(() => Boolean(location.state?.openFilterMode));
    const [categoryCurrentPage, setCategoryCurrentPage] = useState(1);
    const [categoryItemsPerPage, setCategoryItemsPerPage] = useState(10);
    const [bidangStudiOpen, setBidangStudiOpen] = useState(() => window.innerWidth >= 1024);
    const [hargaOpen, setHargaOpen] = useState(() => window.innerWidth >= 1024);
    const [durasiOpen, setDurasiOpen] = useState(() => window.innerWidth >= 1024);
    const featuredSectionRef = useRef(null);
    const categoryClassListRef = useRef(null);
    const classListTopRef = useRef(null);
    const hasPageChangedRef = useRef(false);

    useEffect(() => {
        if (fetchStatus === "idle") {
            dispatch(fetchCourses());
        }
    }, [dispatch, fetchStatus]);

    useEffect(() => {
        const handleResize = () => {
            setCategoryItemsPerPage(window.innerWidth >= 1024 ? 9 : 10);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const {
        selectedCategories,
        selectedPrices,
        selectedDuration,
        searchQuery,
        sortBy,
        currentPage,
        totalPages,
        paginatedCourses,
        filteredCourses,
        setSearchQuery,
        setSortBy,
        setCurrentPage,
        handleReset,
        toggleCategory,
        togglePrice,
        toggleDuration,
    } = useCourseFilterState(courseItems);

    const nonFilterModeCourses = useMemo(
        () =>
            activeCategory === ALL_CLASSES_CATEGORY
                ? courseItems
                : courseItems.filter((course) => course.category === activeCategory),
        [activeCategory, courseItems]
    );

    const categoryTotalPages = Math.ceil(nonFilterModeCourses.length / categoryItemsPerPage);
    const categoryPaginatedCourses = useMemo(
        () =>
            nonFilterModeCourses.slice(
                (categoryCurrentPage - 1) * categoryItemsPerPage,
                categoryCurrentPage * categoryItemsPerPage
            ),
        [categoryCurrentPage, categoryItemsPerPage, nonFilterModeCourses]
    );

    useEffect(() => {
        if (categoryCurrentPage > 1) {
            categoryClassListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [categoryCurrentPage]);

    useEffect(() => {
        if (!hasPageChangedRef.current) return;
        classListTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        hasPageChangedRef.current = false;
    }, [currentPage]);

    const handleCategoryPageChange = (page) => {
        setCategoryCurrentPage(page);
    };

    const handleCategoryClick = () => {
        const isMobile = window.innerWidth < 1024;
        setBidangStudiOpen(!isMobile);
        setHargaOpen(!isMobile);
        setDurasiOpen(!isMobile);
        setShowFilterMode((prev) => !prev);
    };

    const handleLogoClick = () => {
        setShowFilterMode(false);
    };

    const handlePageChange = (page) => {
        if (page === currentPage) return;
        hasPageChangedRef.current = true;
        setCurrentPage(page);
    };

    const goPrevPage = () => {
        if (currentPage === 1) return;
        handlePageChange(currentPage - 1);
    };

    const goNextPage = () => {
        if (currentPage === totalPages) return;
        handlePageChange(currentPage + 1);
    };

    const scrollToFeaturedSection = () => {
        featuredSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const filterPanelProps = {
        bidangStudiOpen,
        hargaOpen,
        durasiOpen,
        setBidangStudiOpen,
        setHargaOpen,
        setDurasiOpen,
        selectedCategories,
        selectedPrices,
        selectedDuration,
        toggleCategory,
        togglePrice,
        toggleDuration,
        handleReset,
    };

    const courseControlProps = {
        sortBy,
        setSortBy,
        searchQuery,
        setSearchQuery,
    };

    const isLoading = fetchStatus === "loading";
    const hasFetchError = fetchStatus === "failed";
    const errorMessage = fetchError || "Terjadi kesalahan saat memuat data.";

    const isCategoryActive = (category) => activeCategory === category;

    const handleCategorySelect = (category) => {
        setActiveCategory(category);
        setCategoryCurrentPage(1);
    };

    const categoryPrevPage = () => handleCategoryPageChange(categoryCurrentPage - 1);
    const categoryNextPage = () => handleCategoryPageChange(categoryCurrentPage + 1);

    const renderCategoryEmptyState = () => (
        <p className="col-span-full py-10 text-center text-slate-400">
            Tidak ada kelas untuk kategori ini.
        </p>
    );

    const renderFilteredEmptyState = () => (
        <p className="col-span-full py-10 text-center text-slate-400">
            Tidak ada kelas ditemukan.
        </p>
    );

    const renderFilterPanel = (className = "") => (
        <div className={className}>
            <FilterPanel {...filterPanelProps} />
        </div>
    );

    const renderCourseControls = (mobile = false) => (
        <CourseControls {...courseControlProps} mobile={mobile} />
    );

    const renderBody = () => {
        if (isLoading) {
            return (
                <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-7xl items-center justify-center px-5 py-7 sm:px-6 lg:px-8 lg:py-16">
                    <p className="text-lg font-medium text-slate-500">Memuat data kelas...</p>
                </main>
            );
        }

        if (hasFetchError) {
            return (
                <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-7xl flex-col items-center justify-center gap-4 px-5 py-7 text-center sm:px-6 lg:px-8 lg:py-16">
                    <p className="text-lg font-medium text-red-500">Gagal memuat data kelas.</p>
                    <p className="text-sm text-slate-500">{errorMessage}</p>
                    <button
                        onClick={() => dispatch(fetchCourses())}
                        className="rounded-xl bg-brand-primary px-5 py-2 text-sm font-bold text-white transition hover:brightness-95"
                    >
                        Coba Lagi
                    </button>
                </main>
            );
        }

        return (
            <main className="mx-auto flex w-full max-w-7xl flex-col px-5 py-7 sm:px-6 lg:px-8 lg:py-16">
                {!showFilterMode ? (
                    <>
                        <section
                            className="relative mb-6 overflow-hidden rounded-xl lg:mb-16 min-h-[400px]"
                            style={{
                                backgroundImage: `url(${bannerHero})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="absolute inset-0 bg-black/60" />
                            <div className="relative flex min-h-[400px] flex-col items-center justify-center p-5 text-center text-white sm:p-8">
                                <h1 className="mb-3 max-w-[825px] text-2xl font-bold leading-tight sm:text-3xl lg:text-5xl">
                                    Revolusi Pembelajaran: Temukan Ilmu Baru melalui Platform Video Interaktif!
                                </h1>
                                <p className="mb-6 max-w-[825px] text-sm leading-relaxed text-white/90 sm:text-base">
                                    Temukan ilmu baru yang menarik dan mendalam melalui koleksi video pembelajaran berkualitas tinggi.
                                </p>
                                <button
                                    onClick={scrollToFeaturedSection}
                                    className="rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95 sm:px-7 sm:text-base"
                                >
                                    Temukan Video Course untuk Dipelajari!
                                </button>
                            </div>
                        </section>

                        <section ref={featuredSectionRef} className="mb-6 lg:mb-16">
                            <h2 className="text-2xl font-semibold leading-tight sm:text-[32px]">
                                Koleksi Video Pembelajaran Unggulan
                            </h2>
                            <p className="mt-2.5 text-sm font-medium text-slate-500 sm:text-base">
                                Jelajahi Dunia Pengetahuan Melalui Pilihan Kami!
                            </p>

                            <div className="mt-5 flex gap-6 overflow-x-auto border-b border-gray-200 pb-0 sm:gap-9">
                                {categories.map((category) => {
                                    const isActive = isCategoryActive(category);
                                    return (
                                        <button
                                            key={category}
                                            onClick={() => handleCategorySelect(category)}
                                            className={`relative whitespace-nowrap pb-3 text-sm font-semibold transition sm:text-base ${
                                                isActive
                                                    ? "text-brand-tertiary after:absolute after:bottom-0 after:left-0 after:h-1.5 after:w-1/2 after:rounded-full after:bg-brand-tertiary"
                                                    : "font-medium text-slate-500 hover:text-brand-dark"
                                            }`}
                                        >
                                            {category}
                                        </button>
                                    );
                                })}
                            </div>

                            <div ref={categoryClassListRef} className="mt-8 grid grid-cols-1 gap-6 md2:grid-cols-2 xl:grid-cols-3">
                                {categoryPaginatedCourses.length > 0 ? (
                                    categoryPaginatedCourses.map((course) => <CourseCard key={course.id} course={course} />)
                                ) : renderCategoryEmptyState()}
                            </div>

                            {categoryTotalPages > 1 && (
                                <CoursePagination
                                    currentPage={categoryCurrentPage}
                                    totalPages={categoryTotalPages}
                                    onPrev={categoryPrevPage}
                                    onNext={categoryNextPage}
                                    onSelectPage={handleCategoryPageChange}
                                />
                            )}
                        </section>

                        <section
                            className="relative overflow-hidden rounded-xl min-h-[400px]"
                            style={{
                                backgroundImage: `url(${bannerCta})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="absolute inset-0 bg-black/60" />
                            <div className="relative flex min-h-[400px] flex-col items-center justify-center p-5 text-center text-white sm:p-8">
                                <p className="mb-1 text-base font-medium tracking-wide text-white/80 sm:text-lg">NEWSLETTER</p>
                                <h2 className="mb-2.5 text-2xl font-semibold sm:text-[32px]">Mau Belajar Lebih Banyak?</h2>
                                <p className="mb-10 max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
                                    Daftarkan dirimu untuk mendapatkan informasi terbaru dan penawaran spesial.
                                </p>
                                <div className="flex w-full max-w-[525px] flex-col gap-4 rounded-none bg-transparent sm:h-[58px] sm:flex-row sm:items-center sm:gap-0 sm:rounded-xl sm:bg-white sm:p-2">
                                    <input
                                        type="email"
                                        placeholder="Masukkan Emailmu"
                                        className="h-10 w-full rounded-xl border border-white/20 bg-white px-4 text-center text-sm text-brand-dark outline-none placeholder:text-slate-400 sm:h-full sm:flex-1 sm:border-0 sm:bg-transparent sm:px-6 sm:text-left sm:text-base"
                                    />
                                    <button className="h-10 rounded-xl bg-brand-secondary px-6 text-sm font-bold text-white transition hover:brightness-95 sm:h-[42px] sm:w-[133px]">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </section>
                    </>
                ) : (
                    <>
                        <section className="mb-6">
                            <h2 className="text-2xl font-semibold leading-tight sm:text-[32px]">
                                Koleksi Video Pembelajaran Unggulan
                            </h2>
                            <p className="mt-2.5 text-sm font-medium text-slate-500 sm:text-base">
                                Jelajahi Dunia Pengetahuan Melalui Pilihan Kami!
                            </p>
                        </section>

                        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                            {renderFilterPanel("hidden lg:block lg:w-[280px] lg:flex-shrink-0")}

                            <div className="flex-1">
                                {renderFilterPanel("mb-4 lg:hidden")}

                                {renderCourseControls()}
                                {renderCourseControls(true)}

                                <div ref={classListTopRef} className="grid grid-cols-1 gap-6 md2:grid-cols-2">
                                    {filteredCourses.length > 0 ? (
                                        paginatedCourses.map((course) => (
                                            <CourseCard key={course.id} course={course} />
                                        ))
                                    ) : renderFilteredEmptyState()}
                                </div>

                                <CoursePagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPrev={goPrevPage}
                                    onNext={goNextPage}
                                    onSelectPage={handlePageChange}
                                />
                            </div>
                        </div>
                    </>
                )}
            </main>
        );
    };

    return (
        <div className="bg-brand-cream font-sans text-brand-dark min-h-screen">
            <HomeNavbar onCategoryClick={handleCategoryClick} onLogoClick={handleLogoClick} showFilterMode={showFilterMode} />
            {renderBody()}
            <Footer />
        </div>
    );
}
