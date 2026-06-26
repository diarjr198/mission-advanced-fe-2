import { useMemo, useState } from "react";
import { ALL_CLASSES_CATEGORY, matchesCourseSearch } from "../utils/course";

export default function useCourseFilterState(courses) {
    const [selectedCategories, setSelectedCategories] = useState([ALL_CLASSES_CATEGORY]);
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [selectedDuration, setSelectedDuration] = useState("");
    const [searchQuery, setSearchQueryValue] = useState("");
    const [sortBy, setSortByValue] = useState("Urutkan");
    const [currentPage, setCurrentPage] = useState(1);

    const setSearchQuery = (value) => {
        setSearchQueryValue(value);
        setCurrentPage(1);
    };

    const setSortBy = (value) => {
        setSortByValue(value);
        setCurrentPage(1);
    };

    const handleReset = () => {
        setSelectedCategories([ALL_CLASSES_CATEGORY]);
        setSelectedPrices([]);
        setSelectedDuration("");
        setSearchQueryValue("");
        setSortByValue("Urutkan");
        setCurrentPage(1);
    };

    const toggleCategory = (category) => {
        setCurrentPage(1);
        if (category === ALL_CLASSES_CATEGORY) {
            setSelectedCategories([ALL_CLASSES_CATEGORY]);
            return;
        }

        const withoutAll = selectedCategories.filter((c) => c !== ALL_CLASSES_CATEGORY);
        if (withoutAll.includes(category)) {
            const next = withoutAll.filter((c) => c !== category);
            setSelectedCategories(next.length ? next : [ALL_CLASSES_CATEGORY]);
        } else {
            setSelectedCategories([...withoutAll, category]);
        }
    };

    const togglePrice = (price) => {
        setCurrentPage(1);
        setSelectedPrices((prev) =>
            prev.includes(price) ? prev.filter((p) => p !== price) : [...prev, price]
        );
    };

    const toggleDuration = (duration) => {
        setCurrentPage(1);
        setSelectedDuration((prev) => (prev === duration ? "" : duration));
    };

    const filteredCourses = useMemo(() => {
        let result = [...courses];

        if (!selectedCategories.includes(ALL_CLASSES_CATEGORY)) {
            result = result.filter((c) => selectedCategories.includes(c.category));
        }

        if (selectedPrices.length > 0) {
            result = result.filter((c) => {
                const value = parseInt(c.price.replace(/[^0-9]/g, ""), 10) * 1000;
                return selectedPrices.some((p) => {
                    if (p === "Gratis") return value === 0;
                    if (p === "< Rp 200K") return value < 200000;
                    if (p === "Rp 200K - Rp 400K") return value >= 200000 && value <= 400000;
                    if (p === "> Rp 400K") return value > 400000;
                    return false;
                });
            });
        }

        if (selectedDuration) {
            result = result.filter((c) => {
                const durationValue = parseFloat(c.duration) || 0;
                if (selectedDuration === "< 5 Jam") return durationValue < 5;
                if (selectedDuration === "5 - 10 Jam") return durationValue >= 5 && durationValue <= 10;
                if (selectedDuration === "> 10 Jam") return durationValue > 10;
                return true;
            });
        }

        if (searchQuery.trim()) {
            result = result.filter((course) => matchesCourseSearch(course, searchQuery));
        }

        switch (sortBy) {
            case "Terpopuler":
                result.sort((a, b) => b.reviews - a.reviews);
                break;
            case "Rating Tertinggi":
                result.sort((a, b) => b.rating - a.rating);
                break;
            case "Harga Terendah":
                result.sort(
                    (a, b) =>
                        parseInt(a.price.replace(/[^0-9]/g, ""), 10) -
                        parseInt(b.price.replace(/[^0-9]/g, ""), 10)
                );
                break;
            case "Harga Tertinggi":
                result.sort(
                    (a, b) =>
                        parseInt(b.price.replace(/[^0-9]/g, ""), 10) -
                        parseInt(a.price.replace(/[^0-9]/g, ""), 10)
                );
                break;
            default:
                result.sort((a, b) => b.id - a.id);
                break;
        }

        return result;
    }, [courses, selectedCategories, selectedPrices, selectedDuration, searchQuery, sortBy]);

    const coursesPerPage = 6;
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    const activePage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

    const paginatedCourses = useMemo(
        () =>
            filteredCourses.slice(
                (activePage - 1) * coursesPerPage,
                activePage * coursesPerPage
            ),
        [filteredCourses, activePage]
    );

    return {
        selectedCategories,
        selectedPrices,
        selectedDuration,
        searchQuery,
        sortBy,
        currentPage: activePage,
        totalPages,
        paginatedCourses,
        filteredCourses,
        setSearchQuery,
        setSortBy,
        setCurrentPage,
        handleReset,
        toggleCategory,
        togglePrice,
        toggleDuration,
    };
}
