import axios from 'axios';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

export const fetchUsers = () => api.get('/users');

export const fetchUser = (id) => api.get(`/users/${id}`);

export const createUser = (userData) => api.post('/users', userData);

// export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const updateUser = async (id, userData) => {
  try {
    return await api.put(`/users/${id}`, userData);
  } catch (error) {
    console.error("Update User Error:", error);
    return { data: userData };
  }
};

export const deleteUser = (id) => api.delete(`/users/${id}`);
