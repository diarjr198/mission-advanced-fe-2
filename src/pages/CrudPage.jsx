import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HomeNavbar from "../components/layout/HomeNavbar";
import Footer from "../components/layout/Footer";
import CourseCard from "../components/ui/CourseCard";
import CourseCrudPanel from "../components/home/CourseCrudPanel";
import CoursePagination from "../components/home/CoursePagination";
import { categories } from "../assets/data/courses";
import { ALL_CLASSES_CATEGORY, matchesCourseSearch } from "../utils/course";
import {
    createCourse,
    deleteCourse,
    fetchCourses,
    selectCourseItems,
    selectCoursesFetchError,
    selectCoursesFetchStatus,
    updateCourse,
} from "../stores/redux/courseSlice";

const ITEMS_PER_PAGE = 6;

export default function CrudPage() {
    const dispatch = useDispatch();
    const courseItems = useSelector(selectCourseItems);
    const fetchStatus = useSelector(selectCoursesFetchStatus);
    const error = useSelector(selectCoursesFetchError);
    const loading = fetchStatus === "loading";
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (fetchStatus === "idle" || fetchStatus === "failed") {
            dispatch(fetchCourses());
        }
    }, [dispatch, fetchStatus]);

    const filteredCourseItems = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return courseItems;
        }

        return courseItems.filter((course) =>
            matchesCourseSearch(course, query, ["title", "instructor", "category"])
        );
    }, [courseItems, searchQuery]);

    const totalPages = Math.ceil(filteredCourseItems.length / ITEMS_PER_PAGE);
    const activePage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;
    const paginatedCourseItems = filteredCourseItems.slice(
        (activePage - 1) * ITEMS_PER_PAGE,
        activePage * ITEMS_PER_PAGE
    );

    const handleSearchChange = (value) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleCreateCourse = async (payload) => {
        await dispatch(createCourse(payload)).unwrap();
        setCurrentPage(1);
    };

    const handleUpdateCourse = (id, payload) => dispatch(updateCourse({ id, payload })).unwrap();

    const handleDeleteCourse = async (id) => {
        await dispatch(deleteCourse(id)).unwrap();
    };

    const errorMessage = error?.message || "Terjadi kesalahan saat memuat data.";
    const hasFetchError = fetchStatus === "failed";

    const handlePageChange = (page) => {
        if (page === activePage) return;
        setCurrentPage(page);
    };

    const handlePrevPage = () => {
        if (activePage === 1) return;
        setCurrentPage(activePage - 1);
    };

    const handleNextPage = () => {
        if (activePage === totalPages) return;
        setCurrentPage(activePage + 1);
    };

    return (
        <div className="bg-brand-cream font-sans text-brand-dark min-h-screen">
            <HomeNavbar onCategoryClick={() => {}} showFilterMode={false} />

            <main className="mx-auto flex w-full max-w-7xl flex-col px-5 py-7 sm:px-6 lg:px-8 lg:py-16">
                <section className="mb-6">
                    <h2 className="text-2xl font-semibold leading-tight sm:text-[32px]">Fitur CRUD Kelas</h2>
                    <p className="mt-2.5 text-sm font-medium text-slate-500 sm:text-base">Create, Read, Update, Delete data kelas langsung di halaman ini.</p>
                </section>

                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <p className="text-lg font-medium text-slate-500">Memuat data kelas...</p>
                    </div>
                ) : hasFetchError ? (
                    <div className="flex h-64 flex-col items-center justify-center">
                        <p className="text-lg font-medium text-red-500">Gagal memuat data.</p>
                        <p className="text-sm text-slate-500">{errorMessage}</p>
                    </div>
                ) : (
                    <>
                        <CourseCrudPanel
                            categories={categories.filter((category) => category !== ALL_CLASSES_CATEGORY)}
                            onCreate={handleCreateCourse}
                            onUpdate={handleUpdateCourse}
                            onDelete={handleDeleteCourse}
                            items={paginatedCourseItems}
                            searchQuery={searchQuery}
                            onSearchChange={handleSearchChange}
                        />

                        <section>
                            <h3 className="mb-4 text-lg font-semibold text-brand-dark">Hasil Data (Read)</h3>
                            {paginatedCourseItems.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 md2:grid-cols-2 xl:grid-cols-3">
                                    {paginatedCourseItems.map((course) => (
                                        <CourseCard key={course.id} course={course} />
                                    ))}
                                </div>
                            ) : (
                                <p className="py-10 text-center text-slate-400">Tidak ada data kelas ditemukan.</p>
                            )}

                            <CoursePagination
                                currentPage={activePage}
                                totalPages={totalPages}
                                onPrev={handlePrevPage}
                                onNext={handleNextPage}
                                onSelectPage={handlePageChange}
                            />
                        </section>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
