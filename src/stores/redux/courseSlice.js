import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { courseService } from "../../services/api/courseService";

const initialState = {
    items: [],
    fetchStatus: "idle",
    fetchError: null,
};

const replaceCourseById = (items, updatedCourse) =>
    items.map((item) =>
        String(item.id) === String(updatedCourse.id) ? updatedCourse : item
    );

const removeCourseById = (items, id) =>
    items.filter((item) => String(item.id) !== String(id));

const stripCourseId = (payload) => {
    const { id: _, ...cleanPayload } = payload;
    return cleanPayload;
};

export const fetchCourses = createAsyncThunk(
    "courses/fetchCourses",
    () => courseService.getCourses(),
    {
        condition: (_, { getState }) => {
            const { fetchStatus } = getState().courses;
            return fetchStatus !== "loading";
        },
    }
);

export const createCourse = createAsyncThunk(
    "courses/createCourse",
    (payload) => courseService.createCourse(payload)
);

export const updateCourse = createAsyncThunk(
    "courses/updateCourse",
    ({ id, payload }) => courseService.updateCourse(id, stripCourseId(payload))
);

export const deleteCourse = createAsyncThunk(
    "courses/deleteCourse",
    (id) => courseService.deleteCourse(id).then(() => id)
);

const courseSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.fetchStatus = "loading";
                state.fetchError = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.fetchStatus = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.fetchStatus = "failed";
                state.fetchError = action.error?.message || "Terjadi kesalahan saat memuat data.";
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.items = [action.payload, ...state.items];
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                state.items = replaceCourseById(state.items, action.payload);
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.items = removeCourseById(state.items, action.payload);
            });
    },
});

export const selectCourseItems = (state) => state.courses.items;
export const selectCoursesFetchStatus = (state) => state.courses.fetchStatus;
export const selectCoursesFetchError = (state) => state.courses.fetchError;

export default courseSlice.reducer;
