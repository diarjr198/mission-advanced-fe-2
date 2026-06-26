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

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, loading, error } = useAuth();
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await login(formData.email, formData.password);
            navigate("/");
        } catch {
            return;
        }
    };

    return (
        <div className="bg-brand-cream font-sans text-brand-dark min-h-screen">
            <AuthNavbar />
            <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <AuthCard
                    title="Masuk ke Akun"
                    subtitle="Yuk, lanjutin belajarmu di videobelajar."
                >
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <InputField
                            id="email"
                            label="E-mail"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

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

                        <div className="text-right">
                            <a
                                href="#"
                                className="text-sm font-medium text-slate-600 hover:text-brand-primary sm:text-base"
                            >
                                Lupa Password?
                            </a>
                        </div>

                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? "Memproses..." : "Masuk"}
                        </Button>
                        <Button
                            variant="soft"
                            type="button"
                            onClick={() => navigate("/register")}
                        >
                            Daftar
                        </Button>
                    </form>

                    <Divider />

                    <Button variant="outline" onClick={() => navigate("/")}>
                        <GoogleIcon />
                        Masuk dengan Google
                    </Button>
                </AuthCard>
            </main>
        </div>
    );
}
