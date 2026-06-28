import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import HomeNavbar from "../components/layout/HomeNavbar";
import Footer from "../components/layout/Footer";
import Button from "../components/ui/Button";
import { courseService } from "../services/api/courseService";
import {
    CourseSummaryCard,
    DetailCard,
    OrderSummaryCard,
    PaymentStepper,
} from "./PaymentMethodPage";

const VIRTUAL_ACCOUNT_NUMBER = "11739 081234567890";
const PAYMENT_COUNTDOWN_SECONDS = 50 * 60 + 55;

const formatTimerUnit = (value) => String(value).padStart(2, "0");

const getPaymentGuideName = (label) => label.replace(/^Bank\s+/i, "");

const getPaymentInstructions = (methodName) => [
    {
        title: `ATM ${methodName}`,
        steps: [
            "Masukkan kartu ATM dan PIN.",
            "Pilih menu Transaksi Lainnya, lalu pilih Transfer.",
            "Pilih Virtual Account dan masukkan nomor virtual account.",
            "Periksa detail pembayaran, lalu konfirmasi transaksi.",
        ],
    },
    {
        title: `Mobile Banking ${methodName}`,
        steps: [
            "Login ke aplikasi mobile banking.",
            "Pilih menu Transfer atau Virtual Account.",
            "Masukkan nomor virtual account.",
            "Periksa detail pembayaran, lalu pilih Bayar.",
        ],
    },
    {
        title: `Internet Banking ${methodName}`,
        steps: [
            "Login ke halaman internet banking.",
            "Pilih menu Transfer Dana atau Virtual Account.",
            "Masukkan nomor virtual account.",
            "Ikuti instruksi sampai transaksi berhasil.",
        ],
    },
];

function CountdownTimer() {
    const [remainingSeconds, setRemainingSeconds] = useState(PAYMENT_COUNTDOWN_SECONDS);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setRemainingSeconds((current) => Math.max(current - 1, 0));
        }, 1000);

        return () => window.clearInterval(timer);
    }, []);

    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;
    const timerItems = [hours, minutes, seconds].map(formatTimerUnit);

    return (
        <div className="flex min-h-14 items-center justify-center bg-[#FEE8D2CC] px-5 py-3 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 font-['DM_Sans'] text-[14px] font-medium leading-[140%] tracking-[0.2px] text-[#333333AD] lg:text-[18px]">
                <span>Selesaikan pemesanan dalam</span>
                <div className="flex items-center gap-[10px]">
                    {timerItems.map((item, index) => (
                        <span key={`${item}-${index}`} className="flex items-center gap-[10px]">
                            <span className="flex h-[26px] w-[26px] items-center justify-center rounded-[4px] bg-[#F64920] font-['DM_Sans'] text-[12px] font-bold leading-[140%] tracking-[0.2px] text-white lg:h-8 lg:w-8 lg:text-[16px]">
                                {item}
                            </span>
                            {index < timerItems.length - 1 && <span>:</span>}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

function PaymentVirtualAccountCard({ selectedMethod }) {
    const handleCopy = () => {
        navigator.clipboard?.writeText(VIRTUAL_ACCOUNT_NUMBER);
    };

    return (
        <div className="mb-6">
            <h2 className="mb-6 font-['Poppins'] text-[18px] font-semibold leading-[120%] tracking-normal text-[#000000] lg:text-[20px]">
                Metode Pembayaran
            </h2>

            <div className="rounded-[10px] border border-[#3A35411F] bg-white px-5 py-9 text-center">
                {selectedMethod.icons?.length > 0 && (
                    <div className="mb-3 flex justify-center gap-3">
                        {selectedMethod.icons.map((icon) => (
                            <img key={icon} src={icon} alt="" className="max-h-9 w-auto object-contain" />
                        ))}
                    </div>
                )}

                <p className="mb-3 font-['DM_Sans'] text-[16px] font-medium leading-[140%] tracking-[0.2px] text-[#222325] lg:text-[18px]">
                    Bayar Melalui Virtual Account {selectedMethod.label}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                    <span className="font-['DM_Sans'] text-[16px] font-bold leading-[140%] tracking-[0.2px] text-[#333333AD] lg:text-[18px]">
                        {VIRTUAL_ACCOUNT_NUMBER}
                    </span>
                    <button onClick={handleCopy} className="font-['DM_Sans'] text-[14px] font-bold leading-[140%] tracking-[0.2px] text-[#F64920] lg:text-[16px]">
                        Salin
                    </button>
                </div>
            </div>
        </div>
    );
}

function PaymentInstructionAccordion({ guide }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="rounded-[10px] border border-[#3A35411F] bg-white">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
                <span className="font-['DM_Sans'] text-[14px] font-bold leading-[140%] tracking-[0.2px] text-[#222325] lg:text-[16px]">
                    {guide.title}
                </span>
                <svg
                    className={`h-6 w-6 text-[#333333AD] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <ol className="space-y-2 px-5 pb-4 font-['DM_Sans'] text-[16px] font-normal leading-[140%] tracking-[0.2px] text-[#333333AD] lg:text-[18px]">
                    {guide.steps.map((step, index) => (
                        <li key={step} className="flex gap-2">
                            <span>{index + 1}.</span>
                            <span>{step}</span>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}

function PaymentInstructionCard({ selectedMethod }) {
    const guides = getPaymentInstructions(getPaymentGuideName(selectedMethod.label));

    return (
        <DetailCard>
            <h2 className="mb-6 font-['Poppins'] text-[18px] font-semibold leading-[120%] tracking-normal text-[#000000] lg:text-[20px]">
                Tata Cara Pembayaran
            </h2>

            <div className="space-y-[10px]">
                {guides.map((guide) => (
                    <PaymentInstructionAccordion key={guide.title} guide={guide} />
                ))}
            </div>
        </DetailCard>
    );
}

export default function PaymentInformationPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const selectedMethod = location.state?.selectedMethod || {
        category: "Metode Pembayaran",
        label: "Belum dipilih",
    };

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await courseService.getCourseById(id);
                setCourse(data);
            } catch {
                setError("Gagal memuat informasi pembayaran.");
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
            <Button variant="primary" onClick={() => navigate(`/course/${id}/payment`)}>Kembali ke Metode Pembayaran</Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-brand-cream">
            <HomeNavbar paymentStepper={<PaymentStepper activeStep={1} />} />
            <CountdownTimer />

            <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
                <PaymentStepper activeStep={1} className="mb-8 lg:hidden" />

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="space-y-8 lg:col-span-2">
                        <OrderSummaryCard course={course} headerContent={<PaymentVirtualAccountCard selectedMethod={selectedMethod} />}>
                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <button onClick={() => navigate(`/course/${id}/payment`)} className="rounded-[10px] border border-[#3ECF4C] py-[10px] text-center font-['DM_Sans'] text-[14px] font-bold leading-[140%] tracking-[0.2px] text-[#3ECF4C] transition hover:bg-[#3ECF4C]/10 lg:text-[16px]">
                                    Ganti Metode Pembayaran
                                </button>
                                <button className="rounded-[10px] bg-brand-primary py-[10px] text-center font-['DM_Sans'] text-[14px] font-bold leading-[140%] tracking-[0.2px] text-white transition hover:brightness-95 lg:text-[16px]">
                                    Bayar Sekarang
                                </button>
                            </div>
                        </OrderSummaryCard>

                        <PaymentInstructionCard selectedMethod={selectedMethod} />
                    </div>

                    <div className="order-first lg:order-none lg:col-span-1">
                        <CourseSummaryCard course={course} />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
