export default function Divider({ label = "atau" }) {
    return (
        <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm font-normal text-slate-500 sm:text-base">
                {label}
            </span>
            <div className="h-px flex-1 bg-gray-200" />
        </div>
    );
}
