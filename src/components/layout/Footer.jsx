import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

const footerSections = [
    {
        title: "Kategori",
        items: ["Digital & Teknologi", "Pemasaran", "Manajemen Bisnis", "Pengembangan Diri", "Desain"],
    },
    {
        title: "Perusahaan",
        items: ["Tentang Kami", "FAQ", "Kebijakan Privasi", "Ketentuan Layanan", "Bantuan"],
    },
    {
        title: "Komunitas",
        items: ["Tips Sukses", "Blog"],
    },
];

const socialLinks = [
    {
        label: "LinkedIn",
        path: "M6.94 8.5A1.56 1.56 0 1 1 6.94 5.4a1.56 1.56 0 0 1 0 3.1ZM5.62 9.75h2.64V18H5.62V9.75Zm4.14 0h2.53v1.13h.04c.35-.67 1.21-1.38 2.49-1.38 2.66 0 3.15 1.75 3.15 4.03V18h-2.64v-3.98c0-.95-.02-2.17-1.32-2.17-1.33 0-1.53 1.03-1.53 2.1V18H9.76V9.75Z",
    },
    {
        label: "Facebook",
        path: "M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.87.25-1.46 1.5-1.46H16.7V4.02c-.29-.04-1.28-.12-2.43-.12-2.4 0-4.04 1.47-4.04 4.17V10H7.5v3h2.73v8h3.27Z",
    },
    {
        label: "Instagram",
        path: "M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9Zm9.45 1.35a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8ZM12 7.8A4.2 4.2 0 1 1 7.8 12 4.2 4.2 0 0 1 12 7.8Zm0 1.8A2.4 2.4 0 1 0 14.4 12 2.4 2.4 0 0 0 12 9.6Z",
    },
    {
        label: "Twitter",
        path: "M18.9 7.15c.01.17.01.34.01.51 0 5.2-3.96 11.19-11.19 11.19A11.1 11.1 0 0 1 2 17.18c.31.04.61.05.93.05 1.84 0 3.53-.63 4.88-1.68a3.94 3.94 0 0 1-3.68-2.73c.24.04.48.06.74.06.35 0 .7-.05 1.02-.13A3.94 3.94 0 0 1 2.75 8.9v-.05c.53.29 1.14.47 1.79.49A3.93 3.93 0 0 1 3.3 6.07c0-.73.2-1.41.54-2 1.96 2.4 4.89 3.98 8.19 4.14a4.44 4.44 0 0 1-.1-.9 3.94 3.94 0 0 1 6.81-2.69 7.74 7.74 0 0 0 2.5-.95 3.94 3.94 0 0 1-1.73 2.17 7.88 7.88 0 0 0 2.26-.62 8.46 8.46 0 0 1-1.97 2.03Z",
    },
];

export default function Footer() {
    const [openSection, setOpenSection] = useState(null);

    return (
        <footer className="border-t border-brand-border bg-white">
            <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6 lg:px-8 lg:py-14">
                <div className="flex flex-col gap-8 lg:flex-row lg:justify-between lg:gap-14">
                    <div className="max-w-[352px]">
                        <Link
                            to="/home"
                            className="mb-4 block h-9 w-[170px] lg:h-auto lg:w-[204px]"
                        >
                            <img
                                src={logo}
                                alt="Videobelajar"
                                className="h-full w-full object-contain"
                            />
                        </Link>

                        <h3 className="mb-3 text-sm font-bold leading-relaxed sm:text-lg">
                            Gali Potensi Anda Melalui Pembelajaran Video di
                            hariesok.id!
                        </h3>
                        <p className="mb-2 text-sm leading-relaxed text-brand-dark sm:text-base">
                            Jl. Usman Effendi No. 50 Lowokwaru, Malang
                        </p>
                        <a
                            href="tel:+6287771231234"
                            className="text-sm leading-relaxed text-brand-dark hover:text-brand-primary sm:text-base"
                        >
                            +62–877–7123–1234
                        </a>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:flex lg:gap-12">
                        {footerSections.map((section) => {
                            const isOpen = openSection === section.title;

                            return (
                                <div key={section.title}>
                                    <button
                                        type="button"
                                        onClick={() => setOpenSection(isOpen ? null : section.title)}
                                        className="flex w-full items-center justify-between text-base font-bold lg:pointer-events-none lg:mb-3"
                                    >
                                        {section.title}
                                        <svg
                                            className={`h-5 w-5 text-slate-500 transition-transform lg:hidden ${isOpen ? "rotate-90" : ""}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                    <ul className={`${isOpen ? "mt-3 max-h-60 opacity-100" : "max-h-0 opacity-0"} overflow-hidden space-y-3 text-sm text-slate-500 transition-all duration-300 sm:text-[15px] lg:mt-0 lg:max-h-none lg:opacity-100`}>
                                        {section.items.map((item) => (
                                            <li key={item}>
                                                <a href="#" className="hover:text-brand-dark">
                                                    {item}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="my-4 h-px bg-gray-200 lg:my-10" />

                <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-xs text-sm font-medium text-slate-500 sm:max-w-none sm:text-base">
                        @2023 Gerobak Sayur All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        {socialLinks.map(({ label, path }) => (
                            <a
                                key={label}
                                href="#"
                                aria-label={label}
                                className="flex h-[35px] w-[35px] items-center justify-center rounded-full border border-brand-dark text-brand-dark transition hover:bg-gray-100"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path d={path} />
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
