import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

export default function AuthNavbar() {
    return (
        <nav className="relative z-50 border-b border-brand-border bg-white">
            <div className="mx-auto flex h-20 max-w-7xl items-center px-5 sm:px-6 lg:px-8">
                <Link
                    to="/"
                    className="block h-10 w-[152px] sm:h-12 sm:w-[200px] lg:h-14 lg:w-[237px]"
                >
                    <img
                        src={logo}
                        alt="Videobelajar"
                        className="h-full w-full object-contain"
                    />
                </Link>
            </div>
        </nav>
    );
}
