import { storage } from './storage';

const API_URL = "http://localhost:8000/api";

export const apiClient = {
  baseUrl: API_URL,
  
  async get(endpoint, requiresAuth = false) {
    return this.request(endpoint, 'GET', null, requiresAuth);
  },

  async post(endpoint, data, requiresAuth = false) {
    return this.request(endpoint, 'POST', data, requiresAuth);
  },

  async put(endpoint, data, requiresAuth = false) {
    return this.request(endpoint, 'PUT', data, requiresAuth);
  },

  async delete(endpoint, requiresAuth = false) {
    return this.request(endpoint, 'DELETE', null, requiresAuth);
  },

  async sendFormData(endpoint, formData, method = 'POST') {
    const token = storage.getToken();
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error in ${method} request to ${endpoint}:`, error);
      throw error;
    }
  },

  async request(endpoint, method, data = null, requiresAuth = false) {
    const headers = { "Content-Type": "application/json" };
    
    if (requiresAuth) {
      const token = storage.getToken();
      if (!token && requiresAuth) {
        throw new Error("No authorization token found");
      }
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error in ${method} request to ${endpoint}:`, error);
      throw error;
    }
  }
};
