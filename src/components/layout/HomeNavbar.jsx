import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import defaultAvatar from "../../assets/images/avatar/avatar-profile.png";
import useAuth from "../../hooks/useAuth";

export default function HomeNavbar({ onCategoryClick, onLogoClick, showFilterMode }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { user: currentUser, logout } = useAuth();

    const handleCategoryNav = () => {
        if (location.pathname === "/") {
            onCategoryClick();
            return;
        }

        navigate("/", { state: { openFilterMode: true } });
    };

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogoClick = (event) => {
        if (location.pathname !== "/") return;
        event.preventDefault();
        onLogoClick?.();
        setMenuOpen(false);
        navigate("/");
    };

    const handleMobileCategoryClick = () => {
        handleCategoryNav();
        setMenuOpen(false);
    };

    const handleLogout = () => {
        setDropdownOpen(false);
        logout();
        navigate("/login");
    };

    const handleMobileLogout = () => {
        logout();
        setMenuOpen(false);
        navigate("/login");
    };

    return (
        <nav className="relative z-50 border-b border-brand-border bg-white">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
                <Link
                    to="/"
                    onClick={handleLogoClick}
                    className="block h-10 w-[152px] sm:h-12 sm:w-[200px] lg:h-14 lg:w-[237px]"
                >
                    <img
                        src={logo}
                        alt="Videobelajar"
                        className="h-full w-full object-contain"
                    />
                </Link>

                <div className="hidden items-center gap-9 md:flex">
                    {currentUser ? (
                        <>
                            <button
                                onClick={handleCategoryNav}
                                className={`text-base font-medium transition ${
                                    showFilterMode
                                        ? "text-brand-primary"
                                        : "text-slate-600 hover:text-brand-primary"
                                }`}
                            >
                                Kategori
                            </button>
                            <Link to="/crud" className="text-base font-medium text-slate-600 transition hover:text-brand-primary">
                                CRUD
                            </Link>

                            <div className="relative flex items-center" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="h-[46px] w-[46px] overflow-hidden rounded-[10px]"
                                >
                                    <img
                                        src={currentUser?.avatar || defaultAvatar}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-48 rounded-xl border border-gray-100 bg-white py-1 shadow-soft">
                                        <div className="border-b border-gray-100 px-4 py-3">
                                            <p className="text-sm font-semibold text-brand-dark line-clamp-1">
                                                {currentUser?.name || "User"}
                                            </p>
                                            <p className="text-xs text-slate-400 line-clamp-1">
                                                {currentUser?.email || "user@email.com"}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-500 transition hover:bg-red-50"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                            >
                                                <path d="M5 3h7a1 1 0 0 1 1 1v2h-2V5H5v14h6v-1h2v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
                                                <path d="M15.293 8.293a1 1 0 0 1 1.414 0L19.414 11H10a1 1 0 0 0 0 2h9.414l-2.707 2.707a1 1 0 0 0 1.414 1.414l4-4a1 1 0 0 0 0-1.414l-4-4a1 1 0 0 0-1.414 0Z" />
                                            </svg>
                                            Keluar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleCategoryNav}
                                className={`text-base font-medium transition ${
                                    showFilterMode
                                        ? "text-brand-primary"
                                        : "text-slate-600 hover:text-brand-primary"
                                }`}
                            >
                                Kategori
                            </button>
                            <button
                                onClick={() => navigate("/login")}
                                className="rounded-[10px] bg-[#3ECF4C] px-[26px] py-[10px] text-base font-bold leading-[140%] tracking-[0.2px] text-white transition hover:bg-[#35b841]"
                            >
                                Masuk
                            </button>
                            <button
                                onClick={() => navigate("/register")}
                                className="rounded-[10px] border border-[#3ECF4C] bg-transparent px-[26px] py-[10px] text-base font-bold leading-[140%] tracking-[0.2px] text-[#3ECF4C] transition hover:bg-[#3ECF4C]/10"
                            >
                                Daftar
                            </button>
                        </>
                    )}
                </div>

                <button
                    className="md:hidden flex flex-col gap-1.5"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span
                        className={`block h-0.5 w-6 bg-brand-dark transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
                    />
                    <span
                        className={`block h-0.5 w-6 bg-brand-dark transition-all ${menuOpen ? "opacity-0" : ""}`}
                    />
                    <span
                        className={`block h-0.5 w-6 bg-brand-dark transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
                    />
                </button>
            </div>

            {menuOpen && (
                <div className="border-t border-brand-border bg-white px-5 py-4 md:hidden">
                    <button
                        onClick={handleMobileCategoryClick}
                        className={`block w-full text-left py-2 text-base font-medium ${
                            showFilterMode
                                ? "text-brand-primary"
                                : "text-slate-600 hover:text-brand-primary"
                        }`}
                    >
                        Kategori
                    </button>

                    {currentUser ? (
                        <>
                            <Link to="/crud" onClick={() => setMenuOpen(false)} className="block py-2 text-base font-medium text-slate-600 hover:text-brand-primary">
                                CRUD
                            </Link>

                            <button
                                onClick={handleMobileLogout}
                                className="block py-2 text-base font-medium text-red-500 hover:text-red-600"
                            >
                                Keluar
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => {
                                    navigate("/login");
                                    setMenuOpen(false);
                                }}
                                className="mt-3 block w-full rounded-[10px] bg-[#3ECF4C] px-[26px] py-[10px] text-base font-bold leading-[140%] tracking-[0.2px] text-white transition hover:bg-[#35b841]"
                            >
                                Masuk
                            </button>
                            <button
                                onClick={() => {
                                    navigate("/register");
                                    setMenuOpen(false);
                                }}
                                className="mt-2 block w-full rounded-[10px] border border-[#3ECF4C] bg-transparent px-[26px] py-[10px] text-base font-bold leading-[140%] tracking-[0.2px] text-[#3ECF4C] transition hover:bg-[#3ECF4C]/10"
                            >
                                Daftar
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
