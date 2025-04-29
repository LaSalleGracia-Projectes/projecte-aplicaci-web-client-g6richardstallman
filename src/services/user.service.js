import { apiClient } from '../utils/api';
import { storage } from '../utils/storage';

export const userService = {
  async getUser() {
    // Implementación para la ruta /user que faltaba
    return apiClient.get('/user', true);
  },
  
  async getProfile() {
    const data = await apiClient.get('/profile', true);
    storage.set('user_info', data.data || data);
    return data;
  },

  async updateProfile(userData) {
    const data = await apiClient.put('/profile', userData, true);
    storage.set('user_info', data.data || data);
    return data;
  },
  
  async changePassword(passwordData) {
    return apiClient.post('/change-password', passwordData, true);
  },

  async deleteAccount(confirmationData) {
    return apiClient.delete('/account', confirmationData, true);
  },

  getStoredUserInfo() {
    return storage.get('user_info');
  },

  storeUserInfo(user) {
    storage.set('user_info', user);
  },

  clearUserInfo() {
    storage.remove('user_info');
  }
}
