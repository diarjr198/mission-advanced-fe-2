import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthNavbar from "../components/layout/AuthNavbar";
import AuthCard from "../components/ui/AuthCard";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import EyeIcon from "../components/ui/EyeIcon";
import Divider from "../components/ui/Divider";
import GoogleIcon from "../components/ui/GoogleIcon";
import useAuth from "../hooks/useAuth";

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register, loading, error } = useAuth();
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phone: "",
        password: "",
        password2: ""
    });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formData.password !== formData.password2) {
            alert("Kata sandi konfirmasi tidak cocok");
            return;
        }

        try {
            await register({
                name: formData.fullname,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                avatar: `https://i.pravatar.cc/150?u=${formData.email}`
            });
            alert("Registrasi berhasil! Silakan login.");
            navigate("/login");
        } catch {
            return;
        }
    };

    return (
        <div className="bg-brand-cream font-sans text-brand-dark min-h-screen">
            <AuthNavbar />
            <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <AuthCard
                    title="Pendaftaran Akun"
                    subtitle="Yuk, daftarkan akunmu sekarang juga!"
                >
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <InputField
                            id="fullname"
                            label="Nama Lengkap"
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            required
                        />

                        <InputField
                            id="email"
                            label="E-mail"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <div>
                            <label
                                htmlFor="phone"
                                className="mb-2 inline-block text-sm text-slate-600 sm:text-base"
                            >
                                No. HP <span className="text-red-600">*</span>
                            </label>
                            <div className="flex gap-3">
                                <div className="flex h-12 w-[40%] min-w-[120px] overflow-hidden rounded-md border border-gray-200 sm:w-[30%]">
                                    <div className="flex items-center border-r border-gray-200 bg-gray-50 px-3">
                                        <img
                                            src="https://flagcdn.com/w40/id.png"
                                            alt="ID"
                                            className="h-[14px] w-5 rounded-[2px] object-cover"
                                        />
                                    </div>
                                    <select
                                        name="code"
                                        className="h-full w-full border-0 bg-white px-2 text-sm outline-none sm:text-base"
                                    >
                                        <option value="62">+62</option>
                                    </select>
                                </div>
                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="h-12 flex-1 rounded-md border border-gray-200 px-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 sm:text-base"
                                    required
                                />
                            </div>
                        </div>

                        <InputField
                            id="password"
                            label="Kata Sandi"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        >
                            <EyeIcon />
                        </InputField>

                        <InputField
                            id="password2"
                            label="Konfirmasi Kata Sandi"
                            type="password"
                            name="password2"
                            value={formData.password2}
                            onChange={handleChange}
                            required
                        >
                            <EyeIcon />
                        </InputField>

                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? "Memproses..." : "Daftar"}
                        </Button>
                        <Button
                            variant="soft"
                            type="button"
                            onClick={() => navigate("/login")}
                        >
                            Masuk
                        </Button>
                    </form>

                    <Divider />

                    <Button variant="outline" onClick={() => navigate("/")}>
                        <GoogleIcon />
                        Daftar dengan Google
                    </Button>
                </AuthCard>
            </main>
        </div>
    );
}
