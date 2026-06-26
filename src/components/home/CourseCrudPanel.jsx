import { useState } from "react";
import { courses as initialCourses } from "../../assets/data/courses";

const emptyForm = {
    title: "",
    description: "",
    instructor: "",
    role: "",
    company: "",
    image: "",
    avatar: "",
    category: "Semua Kelas",
    price: "",
    duration: "0",
};

const formFields = [
    { name: "title", label: "Judul Kelas", placeholder: "Masukkan judul" },
    { name: "instructor", label: "Nama Instructor", placeholder: "Masukkan instructor" },
    { name: "description", label: "Description", placeholder: "Masukkan deskripsi kelas", className: "md2:col-span-2" },
    { name: "role", label: "Role", placeholder: "Contoh: Senior Engineer" },
    { name: "company", label: "Company", placeholder: "Contoh: Gojek" },
    { name: "image", label: "Image URL", placeholder: "https://..." },
    { name: "avatar", label: "Avatar URL", placeholder: "https://..." },
];

const inputClassName = "h-12 w-full rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 sm:text-base";
const labelClassName = "mb-2 inline-block text-sm text-slate-600 sm:text-base";

const toPriceLabel = (value) => {
    const stringValue = String(value || "");
    const digits = stringValue.replace(/[^0-9]/g, "");
    return digits ? `Rp ${digits}K` : "";
};

const toPriceInput = (value) => {
    const stringValue = String(value || "");
    return stringValue.replace(/[^0-9]/g, "");
};

const defaultImageSet = new Set(initialCourses.map((course) => course.image));
const defaultAvatarSet = new Set(initialCourses.map((course) => course.avatar));

const toEditableUrl = (value, defaultSet) => (defaultSet.has(value) ? "" : value);

function FormField({ label, className = "", children }) {
    return (
        <div className={className}>
            <label className={labelClassName}>{label}</label>
            {children}
        </div>
    );
}

export default function CourseCrudPanel({ categories, onCreate, onUpdate, onDelete, items }) {
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateForm = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const submit = async (e) => {
        e.preventDefault();

        if (!form.title.trim() || !form.instructor.trim() || !form.price.trim() || isSubmitting) return;

        const payload = { ...form, price: toPriceLabel(form.price) };

        setIsSubmitting(true);
        try {
            if (editingId) {
                await onUpdate(editingId, payload);
            } else {
                await onCreate(payload);
            }
            resetForm();
        } catch (err) {
            console.error("Gagal menyimpan data:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
        try {
            await onDelete(id);
        } catch (err) {
            console.error("Gagal menghapus data:", err);
        }
    };

    const startEdit = (item) => {
        setEditingId(item.id);
        setForm({
            title: item.title,
            description: item.description || "",
            instructor: item.instructor,
            role: item.role || "",
            company: item.company || "",
            image: toEditableUrl(item.image || "", defaultImageSet),
            avatar: toEditableUrl(item.avatar || "", defaultAvatarSet),
            category: item.category,
            price: toPriceInput(item.price),
            duration: item.duration || "0",
        });
    };

    return (
        <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
            <h3 className="mb-4 text-lg font-semibold text-brand-dark">CRUD Kelas</h3>

            <form onSubmit={submit} className="grid grid-cols-1 gap-3 md2:grid-cols-2">
                {formFields.map((field) => (
                    <FormField key={field.name} label={field.label} className={field.className}>
                        <input
                            value={form[field.name]}
                            onChange={(e) => updateForm(field.name, e.target.value)}
                            placeholder={field.placeholder}
                            className={inputClassName}
                        />
                    </FormField>
                ))}

                <FormField label="Kategori">
                    <select
                        value={form.category}
                        onChange={(e) => updateForm("category", e.target.value)}
                        className="h-12 w-full rounded-md border border-gray-200 bg-white px-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 sm:text-base"
                    >
                        {categories.map((cat) => <option key={cat}>{cat}</option>)}
                    </select>
                </FormField>

                <FormField label="Harga">
                    <div className="flex h-12 w-full items-center rounded-md border border-gray-200 px-3 focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20">
                        <span className="mr-2 text-sm text-slate-600 sm:text-base">Rp</span>
                        <input
                            type="number"
                            min="0"
                            value={form.price}
                            onChange={(e) => updateForm("price", toPriceInput(e.target.value))}
                            placeholder="150"
                            className="h-full w-full border-0 p-0 text-sm outline-none sm:text-base"
                        />
                        <span className="ml-2 text-sm text-slate-600 sm:text-base">K</span>
                    </div>
                </FormField>

                <div className="flex gap-3 md2:col-span-2">
                    <button type="submit" disabled={isSubmitting} className="h-11 rounded-xl bg-brand-primary px-5 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-50 sm:text-base">
                        {isSubmitting ? "Processing..." : (editingId ? "Update" : "Create")}
                    </button>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="h-11 rounded-xl border border-gray-200 bg-white px-5 text-sm font-bold text-slate-600 transition hover:bg-gray-50 sm:text-base">
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="mt-4 space-y-2">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2">
                        <p className="line-clamp-1 text-sm text-slate-600">{item.title}</p>
                        <div className="flex gap-2">
                            <button onClick={() => startEdit(item)} className="rounded-md bg-brand-soft px-3 py-1 text-xs font-medium text-brand-primary transition hover:bg-green-100">Edit</button>
                            <button onClick={() => handleDelete(item.id)} className="rounded-md bg-red-50 px-3 py-1 text-xs font-medium text-red-500 transition hover:bg-red-100">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
