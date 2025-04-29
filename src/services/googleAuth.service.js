import { apiClient } from '../utils/api';
import { storage } from '../utils/storage';

export const googleAuthService = {
  async getAuthUrl() {
    const response = await apiClient.get('/auth/google');
    return response.url;
  },
  
  async handleCallback(code) {
    const response = await apiClient.get(`/auth/google/callback?code=${code}`);
    
    if (response.token) {
      storage.setToken(response.token);
      
      if (response.user) {
        storage.set('user_info', response.user);
      }
    }
    
    return response;
  }
};
