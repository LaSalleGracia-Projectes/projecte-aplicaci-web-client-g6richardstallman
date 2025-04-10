import axios from 'axios';
import { showErrorToast } from '../utils/toastNotifications';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) {
      showErrorToast('Error de conexión. Verifica tu red y vuelve a intentarlo.');
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      localStorage.removeItem('user');
      
      if (window.location.pathname !== '/login') {
        showErrorToast('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.');
        window.location.href = '/login';
      }
    }
    else if (error.response.status >= 500) {
      showErrorToast('Error en el servidor. Por favor, inténtalo más tarde.');
    }
    else if (error.response.status === 422) {
      const validationErrors = error.response.data.errors;
      
      if (validationErrors) {
        const firstError = Object.values(validationErrors)[0];
        showErrorToast(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        showErrorToast('Error de validación. Revisa los datos introducidos.');
      }
    }
    else {
      const message = error.response.data.message || 'Ha ocurrido un error';
      showErrorToast(message);
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  logout: () => api.post('/auth/logout'),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  updatePassword: (data) => api.put('/user/password', data),
  uploadAvatar: (formData) => api.post('/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  closeAccount: (data) => api.post('/user/close-account', data),
  getSettings: () => api.get('/user/settings'),
  updateSettings: (data) => api.put('/user/settings', data),
};

export const eventAPI = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  getPurchases: () => api.get('/user/purchases'),
};

export default api;