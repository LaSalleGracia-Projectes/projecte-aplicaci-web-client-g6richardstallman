import { storage } from "../utils/storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const organizersService = {
  async getAllOrganizers() {
    try {
      // Get auth token to personalize results (favorites)
      const token = storage.getToken(true) || storage.getToken(false);
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      
      const response = await fetch(`${API_URL}/organizadores`, {
        method: "GET",
        headers
      });

      // Process response
      const data = await this._handleResponse(response);
      
      // Ensure avatar_url is properly processed
      const organizers = data.organizadores || [];
      organizers.forEach(organizer => {
        // Make sure avatar_url is processed correctly if it contains a relative path
        if (organizer.avatar_url && !organizer.avatar_url.startsWith('http')) {
          organizer.avatar_url = `${API_URL}/${organizer.avatar_url.replace(/^\//, '')}`;
        }
      });
      
      // Format data consistently for component
      return {
        success: true,
        data: organizers
      };
    } catch (error) {
      console.error("Error getting organizers:", error);
      return { success: false, data: [], error: error.message };
    }
  },

  async getOrganizerById(organizerId) {
    try {
      // Get auth token to personalize results (favorites)
      const token = storage.getToken(true) || storage.getToken(false);
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      const response = await fetch(`${API_URL}/organizadores/${organizerId}`, {
        method: "GET",
        headers
      });
      
      const data = await this._handleResponse(response);
      
      // Process avatar URL to ensure it's fully qualified
      if (data.organizador?.avatar_url && !data.organizador.avatar_url.startsWith('http')) {
        data.organizador.avatar_url = `${API_URL}/${data.organizador.avatar_url.replace(/^\//, '')}`;
      }
      
      // Format data consistently
      return {
        success: true,
        data: data.organizador || {}
      };
    } catch (error) {
      console.error(`Error getting organizer ${organizerId}:`, error);
      return { success: false, data: null, error: error.message };
    }
  },

  async getOrganizerEvents(organizerId) {
    try {
      const response = await fetch(
        `${API_URL}/organizadores/${organizerId}/eventos`, 
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      );
      
      const data = await this._handleResponse(response);
      
      // Format data consistently
      return {
        success: true,
        data: data.eventos || [],
        organizador: data.organizador || {}
      };
    } catch (error) {
      console.error(`Error getting events for organizer ${organizerId}:`, error);
      return { success: false, data: [], error: error.message };
    }
  },
  
  async checkIsFavorite(organizerId) {
    try {
      // This endpoint requires authentication
      const token = storage.getToken(true) || storage.getToken(false);
      
      if (!token) {
        return { success: true, isFavorite: false };
      }
      
      const response = await fetch(
        `${API_URL}/organizadores/${organizerId}/es-favorito`, 
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      const data = await this._handleResponse(response);
      
      return {
        success: true,
        isFavorite: data.is_favorite || false
      };
    } catch (error) {
      console.error(`Error checking if organizer ${organizerId} is favorite:`, error);
      return { success: false, isFavorite: false, error: error.message };
    }
  },

  async _handleResponse(response) {
    if (!response.ok) {
      const errorData = await this._parseErrorResponse(response);
      throw this._formatErrorResponse(response, errorData);
    }

    try {
      return await response.json();
    } catch (e) {
      console.error("Error parsing JSON response:", e);
      throw new Error("Invalid JSON response");
    }
  },

  async _parseErrorResponse(response) {
    try {
      return await response.json();
    } catch (e) {
      return { message: response.statusText };
    }
  },

  _formatErrorResponse(response, errorData) {
    const error = new Error(`HTTP error! status: ${response.status}`);
    error.status = response.status;
    error.statusText = response.statusText;
    error.details = errorData;
    
    return error;
  },
};
