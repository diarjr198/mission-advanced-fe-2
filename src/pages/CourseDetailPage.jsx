import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HomeNavbar from "../components/layout/HomeNavbar";
import Footer from "../components/layout/Footer";
import { courseService } from "../services/api/courseService";
import StarRating from "../components/ui/StarRating";
import Button from "../components/ui/Button";
import CourseCard from "../components/ui/CourseCard";
import { courses as fallbackCourses } from "../assets/data/courses";
import playCircleIcon from "../assets/images/icon/icon_play_circle.svg";
import clockIcon from "../assets/images/icon/icon_clock.svg";
import fileCheckIcon from "../assets/images/icon/icon_file_check.svg";
import bookIcon from "../assets/images/icon/icon_book_2.svg";
import fileEditIcon from "../assets/images/icon/icon_file_edit.svg";
import videoIcon from "../assets/images/icon/icon_video.svg";
import certificateIcon from "../assets/images/icon/icon_file_certificate.svg";
import worldIcon from "../assets/images/icon/icon_world.svg";

const DEFAULT_SYLLABUS = [
    { title: "Pengenalan Kursus", lessons: ["Selamat Datang", "Persiapan Tooling"] },
    { title: "Materi Inti", lessons: ["Konsep Dasar", "Implementasi Praktis"] },
];

const DEFAULT_INSTRUCTOR_BIO =
    "adalah seorang ahli di bidangnya dengan pengalaman bertahun-tahun membantu ribuan siswa mencapai impian mereka.";

const DEFAULT_REVIEW_FEEDBACK =
    "Materi pembelajarannya mudah dipahami, tutor menjelaskan dengan runtut, dan contoh kasusnya sangat relevan dengan kebutuhan industri.";

const INCLUDED_ITEMS = [
    { icon: fileCheckIcon, text: "Ujian Akhir" },
    { icon: videoIcon, text: "49 Video" },
    { icon: bookIcon, text: "7 Dokumen" },
    { icon: certificateIcon, text: "Sertifikat" },
    { icon: fileEditIcon, text: "Pretest" },
];

const getRecommendations = (courses, currentId) =>
    courses.filter((item) => String(item.id) !== String(currentId)).slice(0, 3);

function DetailCard({ title, children, className = "", titleClassName = "" }) {
    return (
        <section className={`rounded-[10px] border border-[#3A35411F] bg-white p-6 shadow-soft ${className}`}>
            {title && (
                <h2 className={`text-lg font-bold text-brand-dark sm:text-xl ${titleClassName}`}>
                    {title}
                </h2>
            )}
            {children}
        </section>
    );
}

function ProfileCard({ avatar, name, meta, description, children }) {
    return (
        <div className="w-full rounded-[10px] border border-[#3A35411F] p-5 md:w-1/2">
            <div className="flex items-center gap-[10px]">
                <img src={avatar} alt={name} className="h-10 w-10 rounded-[10px] object-cover" />
                <div>
                    <h3 className="font-['DM_Sans'] text-[14px] font-medium leading-[140%] tracking-[0.2px] text-[#222325] sm:text-[16px]">
                        {name}
                    </h3>
                    <p className="font-['DM_Sans'] text-[12px] font-normal leading-[140%] tracking-[0.2px] text-[#333333AD] sm:text-[14px]">
                        {meta}
                    </p>
                </div>
            </div>
            <p className="mt-4 font-['DM_Sans'] text-[14px] font-normal leading-[140%] tracking-[0.2px] text-[#222325] sm:text-[16px]">
                {description}
            </p>
            {children}
        </div>
    );
}

function IconList({ items, className = "grid grid-cols-2 gap-4" }) {
    return (
        <ul className={className}>
            {items.map((item) => (
                <li key={item.text} className="flex items-center gap-2 align-middle font-['DM_Sans'] text-[12px] font-normal leading-[140%] tracking-[0.2px] text-[#333333AD] sm:text-[14px]">
                    <img src={item.icon} alt="" className="h-6 w-6" />
                    <span className="translate-y-[1px]">{item.text}</span>
                </li>
            ))}
        </ul>
    );
}

function SectionIntro({ title, subtitle }) {
    return (
        <>
            <h2 className="text-2xl font-semibold leading-tight sm:text-[32px]">
                {title}
            </h2>
            <p className="mt-2.5 text-sm font-medium text-slate-500 sm:text-base">
                {subtitle}
            </p>
        </>
    );
}

export default function CourseDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [recommendedCourses, setRecommendedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSyllabusIndex, setOpenSyllabusIndex] = useState(0);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await courseService.getCourseById(id);
                setCourse(data);

                try {
                    const courses = await courseService.getCourses();
                    const recommendations = getRecommendations(courses, id);
                    setRecommendedCourses(recommendations.length > 0 ? recommendations : getRecommendations(fallbackCourses, id));
                } catch {
                    setRecommendedCourses(getRecommendations(fallbackCourses, id));
                }
            } catch {
                setError("Gagal memuat detail kursus.");
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    if (loading) return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
        </div>
    );

    if (error || !course) return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
            <p className="text-xl font-semibold text-red-500">{error || "Kursus tidak ditemukan"}</p>
            <Button variant="primary" onClick={() => navigate("/")}>Kembali ke Beranda</Button>
        </div>
    );

    const instructorBio = course.instructor_bio || `${course.instructor} ${DEFAULT_INSTRUCTOR_BIO}`;
    const reviewFeedback = course.review_feedback || DEFAULT_REVIEW_FEEDBACK;
    const syllabus = course.syllabus || DEFAULT_SYLLABUS;

    return (
        <div className="min-h-screen bg-brand-cream">
            <HomeNavbar />

            <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
                <nav className="mb-6 flex min-w-0 items-center gap-2 overflow-hidden text-sm font-medium text-slate-500">
                    <button onClick={() => navigate("/")} className="shrink-0 hover:text-brand-primary">Beranda</button>
                    <span className="shrink-0">/</span>
                    <span className="shrink-0 text-slate-500">{course.category || "Kursus"}</span>
                    <span className="shrink-0">/</span>
                    <span className="min-w-0 truncate text-brand-dark">{course.title}</span>
                </nav>

                <section
                    className="relative mb-8 min-h-[400px] overflow-hidden rounded-2xl shadow-soft"
                    style={{
                        backgroundImage: `url(${course.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="relative flex min-h-[400px] flex-col justify-center p-6 text-white sm:p-12 lg:py-16 lg:pr-16 lg:pl-[100px]">
                        <div className="max-w-full lg:max-w-[85%]">
                            <h1 className="mb-3 font-['Poppins'] text-2xl font-semibold leading-[110%] tracking-normal sm:text-3xl lg:text-[40px]">
                                {course.title}
                            </h1>
                            <p className="mb-6 font-['DM_Sans'] text-sm font-medium leading-[140%] tracking-[0.2px] text-white/90 sm:text-base lg:text-base">
                                {course.description}
                            </p>

                            <div className="flex items-center gap-2">
                                <StarRating rating={course.rating} className="text-[18px] leading-none" />
                                <span className="text-xs font-medium text-white/90 underline sm:text-sm">{course.rating} ({course.reviews})</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="space-y-8 lg:col-span-2">
                        <DetailCard title="Deskripsi" className="flex flex-col gap-6">
                            <div className="font-['DM_Sans'] text-sm font-normal leading-[140%] tracking-[0.2px] text-slate-600 sm:text-base">
                                {course.long_description || course.description}
                            </div>
                        </DetailCard>

                        <DetailCard title="Belajar bersama tutor profesional" titleClassName="mb-6">
                            <div className="flex flex-col gap-4 md:flex-row">
                                {[0, 1].map((item) => (
                                    <ProfileCard
                                        key={item}
                                        avatar={course.avatar}
                                        name={course.instructor}
                                        meta={<>{course.role} <span>di</span> <span className="font-bold text-[#333333AD]">{course.company}</span></>}
                                        description={instructorBio}
                                    />
                                ))}
                            </div>
                        </DetailCard>

                        <DetailCard title="Kamu akan Mempelajari" className="flex flex-col gap-6">
                            <div className="flex flex-col gap-6">
                                {syllabus.map((module, idx) => {
                                    const isOpen = openSyllabusIndex === idx;

                                    return (
                                        <div key={module.title}>
                                            <button
                                                type="button"
                                                onClick={() => setOpenSyllabusIndex(isOpen ? null : idx)}
                                                className="flex w-full items-center justify-between text-left"
                                            >
                                                <span className="min-w-0 truncate pr-4 font-['Poppins'] text-[16px] font-semibold leading-[120%] tracking-normal text-[#3ECF4C] sm:text-[18px]">{module.title}</span>
                                                <svg
                                                    className={`h-6 w-6 text-[#333333AD] transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : ""}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                                                <ul className="mt-3 space-y-3">
                                                    {module.lessons.map((lesson) => (
                                                        <li key={lesson} className="flex items-center justify-between gap-4 rounded-[10px] border border-[#3A35411F] px-5 py-[21px] font-['DM_Sans'] text-[14px] font-medium leading-[140%] tracking-[0.2px] text-[#222325] sm:text-[16px]">
                                                            <span>{lesson}</span>
                                                            <div className="hidden shrink-0 items-center gap-4 font-['DM_Sans'] text-[14px] font-normal leading-[140%] tracking-[0.2px] text-[#333333AD] sm:flex sm:text-[16px]">
                                                                <span className="flex items-center gap-2">
                                                                    <img src={playCircleIcon} alt="" className="h-6 w-6" />
                                                                    Video
                                                                </span>
                                                                <span className="flex items-center gap-2">
                                                                    <img src={clockIcon} alt="" className="h-6 w-6" />
                                                                    12 Menit
                                                                </span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </DetailCard>

                        <DetailCard title="Rating dan Review" titleClassName="mb-6">
                            <div className="flex flex-col gap-4 md:flex-row">
                                {[0, 1].map((item) => (
                                    <ProfileCard
                                        key={item}
                                        avatar={course.avatar}
                                        name={course.instructor}
                                        meta={`Alumni Batch ${item + 2}`}
                                        description={reviewFeedback}
                                    >
                                        <div className="mt-4 flex items-center gap-2">
                                            <StarRating rating={4.5} className="text-[18px] leading-none" />
                                            <span className="inline-flex translate-y-[1px] items-center font-['DM_Sans'] text-[12px] font-medium leading-[140%] tracking-[0.2px] text-[#333333AD] sm:text-[14px]">4.5</span>
                                        </div>
                                    </ProfileCard>
                                ))}
                            </div>
                        </DetailCard>
                    </div>

                    <div className="order-first lg:order-none lg:col-span-1">
                        <DetailCard className="lg:sticky lg:top-6">
                            <h2 className="mb-4 font-['Poppins'] text-[16px] font-semibold leading-[120%] tracking-normal text-brand-dark sm:text-[18px]">
                                {course.title}
                            </h2>

                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="font-['Poppins'] text-[16px] font-semibold leading-[120%] tracking-normal text-[#3ECF4C] sm:text-[18px]">
                                        {course.price}
                                    </span>
                                    <span className="font-['DM_Sans'] text-[14px] font-medium leading-[140%] tracking-[0.2px] text-[#3A354161] line-through sm:text-[16px]">
                                        Rp 500.000
                                    </span>
                                </div>
                                <div className="inline-flex items-center rounded-[10px] bg-[#FFBD3A] px-[10px] py-[4px] font-['Roboto'] text-[12px] font-normal leading-[140%] tracking-[0.2px] text-white">
                                    Diskon 50%
                                </div>
                            </div>

                            <p className="mb-6 font-['DM_Sans'] text-[12px] font-medium leading-[140%] tracking-[0.2px] text-[#0980E2] sm:text-[14px]">
                                Penawaran spesial tersisa 2 hari lagi!
                            </p>

                            <button className="mb-6 w-full rounded-[10px] bg-brand-primary py-[10px] text-center font-['DM_Sans'] text-[14px] font-bold leading-[140%] tracking-[0.2px] text-white transition hover:brightness-95 sm:text-[16px]">
                                Beli Sekarang
                            </button>

                            <div className="mb-6 flex flex-col">
                                <p className="mb-4 align-middle font-['Poppins'] text-[12px] font-semibold leading-[21px] tracking-normal text-[#222325] sm:text-[14px]">
                                    Kelas ini Sudah Termasuk
                                </p>
                                <IconList items={INCLUDED_ITEMS} />
                            </div>

                            <div className="flex flex-col">
                                <p className="mb-4 align-middle font-['Poppins'] text-[12px] font-semibold leading-[21px] tracking-normal text-[#222325] sm:text-[14px]">
                                    Bahasa Pengantar
                                </p>
                                <IconList items={[{ icon: worldIcon, text: "Bahasa Indonesia" }]} className="flex flex-col gap-4" />
                            </div>
                        </DetailCard>
                    </div>
                </div>

                <section className="mt-8">
                    <SectionIntro
                        title="Video Pembelajaran Terkait Lainnya"
                        subtitle="Ekspansi Pengetahuan Anda dengan Rekomendasi Spesial Kami!"
                    />

                    <div className="mt-8 grid grid-cols-1 gap-6 md2:grid-cols-2 xl:grid-cols-3">
                        {recommendedCourses.map((item) => (
                            <CourseCard key={item.id} course={item} />
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
