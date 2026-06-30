import { useNavigate, useParams } from "react-router-dom";
import HomeNavbar from "../components/layout/HomeNavbar";
import Footer from "../components/layout/Footer";
import illustration from "../assets/images/ilustration/online-shopping-female_ilustration.svg";
import { PaymentStepper } from "./PaymentMethodPage";

export default function PaymentSuccessPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-brand-cream">
            <HomeNavbar paymentStepper={<PaymentStepper activeStep={2} />} />

            <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-7xl flex-col items-center justify-center px-5 py-8 text-center sm:px-6 lg:px-8">
                <PaymentStepper activeStep={2} className="mb-8 lg:hidden" />

                <img src={illustration} alt="Pembayaran berhasil" className="mb-8 h-auto max-h-[421px] w-auto max-w-full" />
                <h1 className="mb-3 font-['Poppins'] text-[22px] font-semibold leading-[120%] tracking-normal text-[#222325] lg:text-[24px]">
                    Pembayaran Berhasil!
                </h1>
                <p className="mb-6 max-w-[525px] font-['DM_Sans'] text-[16px] font-normal leading-[140%] tracking-[0.2px] text-[#333333AD] lg:text-[18px]">
                    Silakan cek email kamu untuk informasi lebih lanjut. Hubungi kami jika ada kendala.
                </p>
                <button onClick={() => navigate(`/course/${id}`)} className="rounded-[10px] bg-[#3ECF4C] px-[26px] py-[10px] font-['DM_Sans'] text-[14px] font-bold leading-[140%] tracking-[0.2px] text-white transition hover:bg-[#35b841] lg:text-[16px]">
                    Lihat Detail Pesanan
                </button>
            </main>

            <Footer />
        </div>
    );
}
