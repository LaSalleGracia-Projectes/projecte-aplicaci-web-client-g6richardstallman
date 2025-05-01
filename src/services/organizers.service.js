import { storage } from "../utils/storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const organizersService = {
  async getAllOrganizers() {
    try {
      const token = storage.getToken();
      const headers = {
        Accept: "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/organizadores`, {
        headers,
      });
      return this._handleResponse(response);
    } catch (error) {
      console.error("Error getting organizers:", error);
      throw error;
    }
  },

  async getOrganizerById(organizerId) {
    try {
      const token = storage.getToken();
      const headers = {
        Accept: "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/organizadores/${organizerId}`, {
        headers,
      });
      return this._handleResponse(response);
    } catch (error) {
      console.error(`Error getting organizer ${organizerId}:`, error);
      throw error;
    }
  },

  async getOrganizerEvents(organizerId) {
    try {
      const token = storage.getToken();
      const headers = {
        Accept: "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_URL}/organizadores/${organizerId}/eventos`,
        {
          headers,
        }
      );
      return this._handleResponse(response);
    } catch (error) {
      console.error(
        `Error getting events for organizer ${organizerId}:`,
        error
      );
      throw error;
    }
  },

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
    const formattedError = {
      status: response.status,
      statusText: response.statusText,
      message: `HTTP error! status: ${response.status}`,
      errors: errorData,
    };

    console.error("API Error:", formattedError);
    return formattedError;
  },
};
