import { useEffect, useState, useCallback } from "react";
import { courseService } from "../services/api/courseService";

export default function useCoursesStore() {
    const [courseItems, setCourseItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);
            const data = await courseService.getCourses();
            setCourseItems(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const createCourse = useCallback(async (payload) => {
        try {
            setError(null);
            const newCourse = await courseService.createCourse(payload);
            setCourseItems((prev) => [newCourse, ...prev]);
        } catch (err) {
            setError(err);
            throw err;
        }
    }, []);

    const updateCourse = useCallback(async (id, payload) => {
        try {
            setError(null);

            const { id: _, ...cleanPayload } = payload;

            const updatedCourse = await courseService.updateCourse(id, cleanPayload);
            setCourseItems((prev) =>
                prev.map((item) => (String(item.id) === String(id) ? updatedCourse : item))
            );
        } catch (err) {
            setError(err);
            throw err;
        }
    }, []);

    const deleteCourse = useCallback(async (id) => {
        try {
            setError(null);
            await courseService.deleteCourse(id);
            setCourseItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
        } catch (err) {
            setError(err);
            throw err;
        }
    }, []);

    return { courseItems, createCourse, updateCourse, deleteCourse, loading, error, refreshCourses: fetchCourses };
}
