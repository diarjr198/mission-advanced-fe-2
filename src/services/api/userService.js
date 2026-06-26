import apiClient from "./apiClient";

export const userService = {
  findUserByEmail: (email) => apiClient.get('/users', { params: { email } }),
  register: (userData) => apiClient.post('/users', userData),
  getUserById: (id) => apiClient.get(`/users/${id}`),
};
