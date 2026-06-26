import { create } from "zustand";
import { userService } from "../services/api/userService";

const SESSION_KEY = "user-session";

const getStoredUser = () => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
};

const setSession = (user) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const useAuthStore = create((set, get) => ({
    user: getStoredUser(),
    loading: false,
    error: null,

    login: async (email, password) => {
        set({ loading: true, error: null });

        try {
            let users = [];

            try {
                users = await userService.findUserByEmail(email);
            } catch (err) {
                if (err.response?.status === 404) {
                    throw new Error("Email atau password salah");
                }
                throw err;
            }

            const user = users.find((item) => item.email === email && item.password === password);

            if (!user) {
                throw new Error("Email atau password salah");
            }

            setSession(user);
            set({ user, error: null });
            return user;
        } catch (err) {
            set({ error: err.message || "Terjadi kesalahan saat login" });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    register: async (userData) => {
        set({ loading: true, error: null });

        try {
            let isDuplicate = false;

            try {
                const results = await userService.findUserByEmail(userData.email);

                // MockAPI search bisa partial match.
                isDuplicate = Array.isArray(results) && results.some(
                    (user) => user.email.toLowerCase() === userData.email.toLowerCase()
                );
            } catch (err) {
                if (err.response?.status === 404) {
                    isDuplicate = false;
                } else {
                    throw err;
                }
            }

            if (isDuplicate) {
                throw new Error("Email sudah terdaftar");
            }

            return await userService.register(userData);
        } catch (err) {
            set({ error: err.message || "Terjadi kesalahan saat registrasi" });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    logout: () => {
        localStorage.removeItem(SESSION_KEY);
        set({ user: null, error: null });
    },

    getCurrentUser: () => get().user,

    clearError: () => set({ error: null }),
}));
