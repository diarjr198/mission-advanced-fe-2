import { useAuthStore } from "../stores/authStore";

export default function useAuth() {
    const user = useAuthStore((state) => state.user);
    const loading = useAuthStore((state) => state.loading);
    const error = useAuthStore((state) => state.error);
    const login = useAuthStore((state) => state.login);
    const register = useAuthStore((state) => state.register);
    const logout = useAuthStore((state) => state.logout);
    const getCurrentUser = useAuthStore((state) => state.getCurrentUser);
    const clearError = useAuthStore((state) => state.clearError);

    return { user, login, register, logout, getCurrentUser, clearError, loading, error };
}
