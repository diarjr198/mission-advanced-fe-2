export default function Button({
    children,
    variant = "primary",
    onClick,
    type = "button",
    className = "",
}) {
    const variants = {
        primary: "bg-brand-primary text-white hover:brightness-95",
        soft: "bg-brand-soft text-brand-primary hover:bg-green-100",
        outline:
            "border border-gray-200 bg-white text-slate-600 hover:bg-gray-50",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`h-11 w-full rounded-xl text-sm font-bold transition sm:text-base flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
