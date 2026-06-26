export default function AuthCard({ title, subtitle, children }) {
    return (
        <section className="w-full max-w-[590px] rounded border border-gray-100 bg-white p-5 shadow-soft sm:p-9">
            <div className="mb-9 text-center">
                <h1 className="mb-2 text-2xl font-semibold sm:text-[32px]">
                    {title}
                </h1>
                <p className="text-sm text-gray-500 sm:text-base">{subtitle}</p>
            </div>
            {children}
        </section>
    );
}
