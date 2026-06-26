import { categories } from "../../assets/data/courses";
import iconBookFilter from "../../assets/images/icon/icon_book_filter.svg";
import iconPriceFilter from "../../assets/images/icon/icon_price_filter.svg";
import iconTimeFilter from "../../assets/images/icon/icon_time_filter.svg";

const hargaOptions = ["Gratis", "< Rp 200K", "Rp 200K - Rp 400K", "> Rp 400K"];
const durasiOptions = ["< 5 Jam", "5 - 10 Jam", "> 10 Jam"];

function FilterSection({ title, icon, open, onToggle, options, selected, onCheck, inputType = "checkbox" }) {
    return (
        <div className="rounded-lg border border-[#3A35411F] px-4 py-3">
            <button onClick={onToggle} className="flex w-full items-center justify-between text-left">
                <div className="flex items-center gap-4 text-brand-primary">
                    {icon}
                    <span className="text-base font-medium leading-[140%] tracking-[0.2px] [font-family:'DM_Sans',sans-serif]">{title}</span>
                </div>
                <svg className={`h-4 w-4 text-brand-primary transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && (
                <div className="mt-[18px] space-y-3">
                    {options.map((opt) => (
                        <label key={opt} className="flex cursor-pointer items-center gap-4">
                            <input
                                type={inputType}
                                checked={Array.isArray(selected) ? selected.includes(opt) : selected === opt}
                                onChange={() => onCheck(opt)}
                                className={`h-[18px] w-[18px] appearance-none border border-[#3ECF4C] bg-[#E2FCD9CC] focus:ring-0 ${
                                    inputType === "radio"
                                        ? "rounded-full checked:bg-[radial-gradient(circle,#3ECF4C_45%,#E2FCD9CC_46%)]"
                                        : "rounded checked:bg-brand-primary checked:bg-[linear-gradient(0deg,#3ECF4C,#3ECF4C)]"
                                }`}
                            />
                            <span className="text-base font-normal leading-[140%] tracking-[0.2px] text-slate-600 [font-family:'DM_Sans',sans-serif]">{opt}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function FilterPanel({
    bidangStudiOpen,
    hargaOpen,
    durasiOpen,
    setBidangStudiOpen,
    setHargaOpen,
    setDurasiOpen,
    selectedCategories,
    selectedPrices,
    selectedDuration,
    toggleCategory,
    togglePrice,
    toggleDuration,
    handleReset,
}) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[18px] font-semibold leading-[120%] tracking-[0] text-slate-600 [font-family:'Poppins',sans-serif]">Filter</h3>
                <button onClick={handleReset} className="text-base font-medium leading-[140%] tracking-[0.2px] text-[#FF5C2B] transition hover:brightness-95 [font-family:'DM_Sans',sans-serif]">
                    Reset
                </button>
            </div>

            <div className="space-y-3">
                <FilterSection
                    title="Bidang Studi"
                    icon={<img src={iconBookFilter} alt="" className="h-5 w-5" />}
                    open={bidangStudiOpen}
                    onToggle={() => setBidangStudiOpen((p) => !p)}
                    options={categories}
                    selected={selectedCategories}
                    onCheck={toggleCategory}
                />

                <FilterSection
                    title="Harga"
                    icon={<img src={iconPriceFilter} alt="" className="h-5 w-5" />}
                    open={hargaOpen}
                    onToggle={() => setHargaOpen((p) => !p)}
                    options={hargaOptions}
                    selected={selectedPrices}
                    onCheck={togglePrice}
                />

                <FilterSection
                    title="Durasi"
                    icon={<img src={iconTimeFilter} alt="" className="h-5 w-5" />}
                    open={durasiOpen}
                    onToggle={() => setDurasiOpen((p) => !p)}
                    options={durasiOptions}
                    selected={selectedDuration}
                    onCheck={toggleDuration}
                    inputType="radio"
                />
            </div>
        </div>
    );
}
