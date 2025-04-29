import { apiClient } from '../utils/api';
import { storage } from '../utils/storage';

export const authService = {
  async register(userData) {
    const data = await apiClient.post('/register', userData);
    if (data.token) {
      storage.setToken(data.token);
    }
    return data;
  },

  async login(credentials) {
    const data = await apiClient.post('/login', credentials);
    if (data.access_token) {
      storage.setToken(data.access_token);
    }
    return data;
  },

  async logout() {
    try {
      const token = storage.getToken();
      if (!token) return { status: 'success', message: 'Ya cerrado sesión' };
      
      const data = await apiClient.post('/logout', null, true);
      
      storage.removeToken();
      storage.remove('user_info');
      
      return data;
    } catch (error) {
      storage.removeToken();
      storage.remove('user_info');
      throw error;
    }
  },

  async resetPassword(email, identificador) {
    return apiClient.post('/reset-password', { email, identificador });
  },

  redirectToLogin(router) {
    if (router) {
      router.replace("/auth/login");
    } else if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  },

  isAuthenticated() {
    return !!storage.getToken();
  }
}
