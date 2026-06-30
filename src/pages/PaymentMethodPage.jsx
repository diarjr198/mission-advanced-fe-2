import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import HomeNavbar from "../components/layout/HomeNavbar";
import Footer from "../components/layout/Footer";
import Button from "../components/ui/Button";
import { courseService } from "../services/api/courseService";
import fileCheckIcon from "../assets/images/icon/icon_file_check.svg";
import bookIcon from "../assets/images/icon/icon_book_2.svg";
import fileEditIcon from "../assets/images/icon/icon_file_edit.svg";
import videoIcon from "../assets/images/icon/icon_video.svg";
import certificateIcon from "../assets/images/icon/icon_file_certificate.svg";
import worldIcon from "../assets/images/icon/icon_world.svg";
import checkCircleIcon from "../assets/images/icon/icon_checkcircle.svg";
import bcaIcon from "../assets/images/wallet/icon_bca.svg";
import bniIcon from "../assets/images/wallet/icon_bni.svg";
import briIcon from "../assets/images/wallet/icon_bri.svg";
import mandiriIcon from "../assets/images/wallet/icon_mandiri.svg";
import danaIcon from "../assets/images/wallet/icon_dana.svg";
import ovoIcon from "../assets/images/wallet/icon_ovo.svg";
import linkajaIcon from "../assets/images/wallet/icon_linkaja.svg";
import shopeepayIcon from "../assets/images/wallet/icon_shopeepay.svg";
import mastercardIcon from "../assets/images/wallet/icon_mastercard.svg";
import visaIcon from "../assets/images/wallet/icon_visa.svg";
import jcbIcon from "../assets/images/wallet/icon_jcb.svg";

const INCLUDED_ITEMS = [
    { icon: fileCheckIcon, text: "Ujian Akhir" },
    { icon: videoIcon, text: "49 Video" },
    { icon: bookIcon, text: "7 Dokumen" },
    { icon: certificateIcon, text: "Sertifikat" },
    { icon: fileEditIcon, text: "Pretest" },
];

const NAVBAR_HEIGHT = 80;
const ADMIN_FEE = 7000;

const PAYMENT_STEPS = ["Pilih Metode", "Bayar", "Selesai"];

const PAYMENT_METHODS = [
    {
        id: "bank-transfer",
        title: "Transfer Bank",
        items: [
            { id: "bca", label: "Bank BCA", icons: [bcaIcon] },
            { id: "bni", label: "Bank BNI", icons: [bniIcon] },
            { id: "bri", label: "Bank BRI", icons: [briIcon] },
            { id: "mandiri", label: "Bank Mandiri", icons: [mandiriIcon] },
        ],
    },
    {
        id: "e-wallet",
        title: "E-Wallet",
        items: [
            { id: "dana", label: "Dana", icons: [danaIcon] },
            { id: "ovo", label: "OVO", icons: [ovoIcon] },
            { id: "linkaja", label: "LinkAja", icons: [linkajaIcon] },
            { id: "shopeepay", label: "Shopee Pay", icons: [shopeepayIcon] },
        ],
    },
    {
        id: "card",
        title: "Kartu Kredit/Debit",
        items: [
            { id: "credit-debit-card", label: "", icons: [mastercardIcon, visaIcon, jcbIcon] },
        ],
    },
];

const findPaymentMethodItem = (paymentId) => {
    const method = PAYMENT_METHODS.find((category) => category.items.some((item) => item.id === paymentId));
    const item = method?.items.find((option) => option.id === paymentId);

    return method && item ? { category: method.title, label: item.label || method.title, id: item.id, icons: item.icons } : null;
};

const findPaymentCategoryId = (paymentId) =>
    PAYMENT_METHODS.find((category) => category.items.some((item) => item.id === paymentId))?.id;

const parsePrice = (price) => {
    const value = String(price || "");
    const digits = Number(value.replace(/[^0-9]/g, ""));

    if (!digits) return 0;

    return /k/i.test(value) ? digits * 1000 : digits;
};

const formatRupiah = (value) => `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;

export function DetailCard({ children, className = "" }) {
    return (
        <section className={`rounded-[10px] border border-[#3A35411F] bg-white p-6 shadow-soft ${className}`}>
            {children}
        </section>
    );
}

function IconList({ items, className = "grid grid-cols-2 gap-4" }) {
    return (
        <ul className={className}>
            {items.map((item) => (
                <li key={item.text} className="flex items-center gap-2 align-middle font-['DM_Sans'] text-[12px] font-normal leading-[140%] tracking-[0.2px] text-[#333333AD] lg:text-[14px]">
                    <img src={item.icon} alt="" className="h-6 w-6" />
                    <span className="translate-y-[1px]">{item.text}</span>
                </li>
            ))}
        </ul>
    );
}

function PaymentOption({ item, selected, onSelect }) {
    const hasLabel = Boolean(item.label);

    return (
        <button
            type="button"
            onClick={onSelect}
            className="flex w-full items-center justify-between rounded-[10px] border border-[#F1F1F1] bg-white px-5 py-4 text-left transition hover:border-brand-primary"
        >
            <span className="flex min-w-0 items-center font-['DM_Sans'] text-[12px] font-normal leading-[140%] tracking-[0.2px] text-[#1D2433] lg:text-[14px]">
                <span className="flex min-h-6 items-center gap-3">
                    {item.icons.map((icon) => (
                        <span key={icon} className="flex h-6 w-6 items-center justify-center">
                            <img src={icon} alt="" className="max-h-6 max-w-6 object-contain" />
                        </span>
                    ))}
                </span>
                {hasLabel && <span className="ml-3 truncate">{item.label}</span>}
            </span>
            {selected && <img src={checkCircleIcon} alt="Terpilih" className="ml-4 h-6 w-6 shrink-0" />}
        </button>
    );
}

export function PaymentStepper({ activeStep = 0, className = "" }) {
    return (
        <div className={`flex justify-center overflow-hidden bg-inherit ${className}`}>
            <div className="flex w-full max-w-[520px] items-center justify-center">
                {PAYMENT_STEPS.map((step, index) => {
                    const isActive = index === activeStep;
                    const isCompleted = index < activeStep;
                    const isGreen = isActive || isCompleted;

                    return (
                        <div key={step} className="flex min-w-0 items-center">
                            <div className="flex shrink-0 items-center gap-[5px]">
                                {isCompleted ? (
                                    <span className="relative z-10 grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full bg-[#3ECF4C]">
                                        <svg className="block h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                ) : (
                                    <span
                                        className={`relative z-10 grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full bg-inherit ${isGreen ? "shadow-[inset_0_0_0_3px_#3ECF4C]" : "shadow-[inset_0_0_0_3px_#3A354161]"}`}
                                    >
                                        <span className={`h-4 w-4 rounded-full ${isGreen ? "bg-[#3ECF4C]" : "bg-[#3A354161]"}`} />
                                    </span>
                                )}
                                <span className={`whitespace-nowrap font-['DM_Sans'] text-[12px] font-bold leading-[140%] tracking-[0.2px] lg:text-[14px] ${isGreen ? "text-[#222325]" : "text-[#3A354161]"}`}>
                                    {step}
                                </span>
                            </div>

                            {index < PAYMENT_STEPS.length - 1 && <span className="relative z-0 ml-3 h-[3px] w-[clamp(12.5px,8vw,73.5px)] shrink-0 bg-[#3A354161]" />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function PaymentAccordion({ method, open, selectedPaymentId, onToggle, onSelect, accordionRef }) {
    return (
        <div ref={accordionRef} className="space-y-3">
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center justify-between rounded-[10px] border border-[#3A35411F] bg-white px-5 py-[17px] text-left"
            >
                <span className="font-['DM_Sans'] text-[14px] font-bold leading-[140%] tracking-[0.2px] text-[#1D2433] lg:text-[16px]">
                    {method.title}
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
                <div className="space-y-3">
                    {method.items.map((item) => (
                        <PaymentOption
                            key={item.id}
                            item={item}
                            selected={selectedPaymentId === item.id}
                            onSelect={() => onSelect(item.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function CourseSummaryCard({ course }) {
    return (
        <DetailCard className="lg:sticky lg:top-6">
            <img src={course.image} alt={course.title} className="mb-4 hidden max-h-[180px] w-full rounded-[10px] object-cover lg:block" />

            <h2 className="mb-4 font-['Poppins'] text-[16px] font-semibold leading-[120%] tracking-normal text-brand-dark lg:text-[18px]">
                {course.title}
            </h2>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="font-['Poppins'] text-[16px] font-semibold leading-[120%] tracking-normal text-[#3ECF4C] sm:text-[18px]">
                        {course.price}
                    </span>
                    <span className="font-['DM_Sans'] text-[14px] font-medium leading-[140%] tracking-[0.2px] text-[#3A354161] line-through sm:text-[16px]">
                        Rp 500.000
                    </span>
                </div>
                <div className="inline-flex items-center rounded-[10px] bg-[#FFBD3A] px-[10px] py-[4px] font-['Roboto'] text-[10px] font-normal leading-[140%] tracking-[0.2px] text-white lg:text-[12px]">
                    Diskon 50%
                </div>
            </div>

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
    );
}

export function OrderSummaryCard({ course, children, headerContent }) {
    const coursePrice = parsePrice(course.price);
    const totalPayment = coursePrice + ADMIN_FEE;
    const labelClassName = "font-['DM_Sans'] text-[16px] font-normal leading-[140%] tracking-[0.2px] text-[#333333AD] lg:text-[18px]";
    const priceClassName = "text-right font-['DM_Sans'] text-[16px] font-bold leading-[140%] tracking-[0.2px] text-[#333333AD] lg:text-[18px]";

    return (
        <DetailCard>
            {headerContent}

            <h2 className="mb-6 font-['Poppins'] text-[18px] font-semibold leading-[120%] tracking-normal text-[#000000] lg:text-[20px]">
                Ringkasan Pesanan
            </h2>

            <div className="grid grid-cols-[minmax(0,7fr)_minmax(120px,3fr)] items-start gap-4">
                <span className={labelClassName}>{course.title}</span>
                <span className={`${priceClassName} pt-0.5`}>{course.price}</span>
            </div>

            <div className="mt-6 grid grid-cols-[minmax(0,7fr)_minmax(120px,3fr)] items-start gap-4">
                <span className={labelClassName}>Biaya Admin</span>
                <span className={priceClassName}>{formatRupiah(ADMIN_FEE)}</span>
            </div>

            <hr className="my-6 border-[#3A35411F]" />

            <div className="grid grid-cols-[minmax(0,7fr)_minmax(120px,3fr)] items-start gap-4">
                <span className="font-['DM_Sans'] text-[16px] font-bold leading-[140%] tracking-[0.2px] text-[#222325] lg:text-[18px]">
                    Total Pembayaran
                </span>
                <span className="text-right font-['Poppins'] text-[18px] font-semibold leading-[120%] tracking-normal text-[#3ECF4C] lg:text-[20px]">
                    {formatRupiah(totalPayment)}
                </span>
            </div>

            {children}
        </DetailCard>
    );
}

export default function PaymentMethodPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isChangingPaymentMethod = location.state?.mode === "change-payment-method";
    const initialPaymentId = location.state?.selectedPaymentId || null;
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openCategoryId, setOpenCategoryId] = useState(findPaymentCategoryId(initialPaymentId) || PAYMENT_METHODS[0].id);
    const [selectedPaymentId, setSelectedPaymentId] = useState(initialPaymentId);
    const accordionRefs = useRef({});

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await courseService.getCourseById(id);
                setCourse(data);
            } catch {
                setError("Gagal memuat metode pembayaran.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    useEffect(() => {
        if (!openCategoryId) return;

        const scrollTimer = window.setTimeout(() => {
            const element = accordionRefs.current[openCategoryId];
            if (!element) return;

            const rect = element.getBoundingClientRect();
            const visibleHeight = window.innerHeight - NAVBAR_HEIGHT;
            const targetTop = window.scrollY + rect.top - NAVBAR_HEIGHT - ((visibleHeight - rect.height) / 2);

            window.scrollTo({
                top: Math.max(targetTop, 0),
                behavior: "smooth",
            });
        }, 100);

        return () => window.clearTimeout(scrollTimer);
    }, [openCategoryId]);

    const toggleCategory = (categoryId) => {
        setOpenCategoryId((current) => (current === categoryId ? null : categoryId));
    };

    const handleBuyNow = () => {
        const selectedMethod = findPaymentMethodItem(selectedPaymentId);
        navigate(`/course/${id}/payment/information`, { state: { selectedPaymentId, selectedMethod } });
    };

    if (loading) return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
        </div>
    );

    if (error || !course) return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
            <p className="text-xl font-semibold text-red-500">{error || "Kursus tidak ditemukan"}</p>
            <Button variant="primary" onClick={() => navigate(`/course/${id}`)}>Kembali ke Detail Kursus</Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-brand-cream">
            <HomeNavbar paymentStepper={<PaymentStepper />} />

            <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
                <PaymentStepper className="mb-8 lg:hidden" />

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="space-y-8 lg:col-span-2">
                        {isChangingPaymentMethod && <OrderSummaryCard course={course} />}

                        <DetailCard>
                            <h1 className="mb-6 font-['Poppins'] text-[18px] font-semibold leading-[120%] tracking-normal text-[#000000] lg:text-[20px]">
                                {isChangingPaymentMethod ? "Ubah Metode Pembayaran" : "Metode Pembayaran"}
                            </h1>

                            <div className="space-y-4">
                                {PAYMENT_METHODS.map((method) => (
                                    <PaymentAccordion
                                        key={method.id}
                                        method={method}
                                        open={openCategoryId === method.id}
                                        selectedPaymentId={selectedPaymentId}
                                        onToggle={() => toggleCategory(method.id)}
                                        onSelect={setSelectedPaymentId}
                                        accordionRef={(element) => {
                                            accordionRefs.current[method.id] = element;
                                        }}
                                    />
                                ))}
                            </div>

                            {isChangingPaymentMethod && (
                                <button onClick={handleBuyNow} className="mt-6 w-full rounded-[10px] bg-brand-primary py-[10px] text-center font-['DM_Sans'] text-[14px] font-bold leading-[140%] tracking-[0.2px] text-white transition hover:brightness-95 lg:text-[16px]">
                                    Bayar Sekarang
                                </button>
                            )}
                        </DetailCard>

                        {!isChangingPaymentMethod && (
                            <OrderSummaryCard course={course}>
                                <button onClick={handleBuyNow} className="mt-6 w-full rounded-[10px] bg-brand-primary py-[10px] text-center font-['DM_Sans'] text-[14px] font-bold leading-[140%] tracking-[0.2px] text-white transition hover:brightness-95 lg:text-[16px]">
                                    Beli Sekarang
                                </button>
                            </OrderSummaryCard>
                        )}
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
