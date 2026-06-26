export const ALL_CLASSES_CATEGORY = "Semua Kelas";

export const formatCoursePrice = (value) => {
    const stringValue = String(value || "");
    const digits = stringValue.replace(/[^0-9]/g, "");
    return digits ? `Rp ${digits}K` : "";
};

export const parseCoursePriceInput = (value) => {
    const stringValue = String(value || "");
    return stringValue.replace(/[^0-9]/g, "");
};

export const matchesCourseSearch = (course, query, fields = ["title", "instructor"]) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
        return true;
    }

    return fields
        .map((field) => course[field])
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery));
};
