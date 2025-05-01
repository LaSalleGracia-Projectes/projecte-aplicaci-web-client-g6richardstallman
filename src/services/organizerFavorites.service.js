import { storage } from '../utils/storage';

const API_URL = "http://localhost:8000/api";

export const organizerFavoritesService = {
  async getFavoriteOrganizers() {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No authorization token found");
    }
    
    const response = await fetch(`${API_URL}/organizadores-favoritos`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    
    return this._handleResponse(response);
  },
  
  async addToFavorites(organizerId) {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No authorization token found");
    }
    
    const response = await fetch(`${API_URL}/organizadores-favoritos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idOrganizador: organizerId })
    });
    
    return this._handleResponse(response);
  },
  
  async removeFromFavorites(organizerId) {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No authorization token found");
    }
    
    const response = await fetch(`${API_URL}/organizadores-favoritos/${organizerId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    
    return this._handleResponse(response);
  },
  
  async checkIsFavorite(organizerId) {
    try {
      const token = storage.getToken();
      if (!token) {
        return { is_favorite: false };
      }
      
      const response = await fetch(`${API_URL}/organizadores-favoritos/check/${organizerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      return this._handleResponse(response);
    } catch (error) {
      return { is_favorite: false };
    }
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
