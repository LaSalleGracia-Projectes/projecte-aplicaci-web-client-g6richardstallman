import { storage } from '../utils/storage';

const API_URL = "http://localhost:8000/api";

export const googleAuthService = {
  async getAuthUrl() {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'GET',
    });
    
    const data = await this._handleResponse(response);
    return data.url;
  },
  
  async handleCallback(code) {
    const response = await fetch(`${API_URL}/auth/google/callback?code=${code}`, {
      method: 'GET',
    });
    
    const data = await this._handleResponse(response);
    
    if (data.token) {
      // Guardar en sessionStorage (useSession=true)
      storage.setToken(data.token, true);
      
      if (data.user) {
        // Guardar en sessionStorage (useSession=true)
        storage.set('user_info', data.user, true);
      }
    }
    
    return data;
  },

  // Helper method to handle API responses
  async _handleResponse(response) {
    if (!response.ok) {
      const errorData = await this._parseErrorResponse(response);
      throw this._formatErrorResponse(response, errorData);
    }
    
    return response.json();
  },

  async _parseErrorResponse(response) {
    try {
      return await response.json();
    } catch (e) {
      return { message: response.statusText };
    }
  },

  _formatErrorResponse(response, errorData) {
    return {
      status: response.status,
      statusText: response.statusText,
      message: `HTTP error! status: ${response.status}`,
      errors: errorData
    };
  }
};
