import HomeNavbar from "../components/layout/HomeNavbar";
import Footer from "../components/layout/Footer";
import CourseCard from "../components/ui/CourseCard";
import CourseCrudPanel from "../components/home/CourseCrudPanel";
import { categories } from "../assets/data/courses";
import useCoursesStore from "../hooks/useCoursesStore";

export default function CrudPage() {
    const { courseItems, createCourse, updateCourse, deleteCourse, loading, error } = useCoursesStore();

    const handleCreateCourse = (payload) => createCourse(payload);
    const handleUpdateCourse = (id, payload) => updateCourse(id, payload);
    const handleDeleteCourse = (id) => deleteCourse(id);

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
                ) : error ? (
                    <div className="flex h-64 flex-col items-center justify-center">
                        <p className="text-lg font-medium text-red-500">Gagal memuat data.</p>
                        <p className="text-sm text-slate-500">{error.message}</p>
                    </div>
                ) : (
                    <>
                        <CourseCrudPanel
                            categories={categories}
                            onCreate={handleCreateCourse}
                            onUpdate={handleUpdateCourse}
                            onDelete={handleDeleteCourse}
                            items={courseItems}
                        />

                        <section>
                            <h3 className="mb-4 text-lg font-semibold text-brand-dark">Hasil Data (Read)</h3>
                            <div className="grid grid-cols-1 gap-6 md2:grid-cols-2 xl:grid-cols-3">
                                {courseItems.map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
