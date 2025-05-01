import { storage } from "../utils/storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const organizersService = {
  async getAllOrganizers() {
    const response = await fetch(`${API_URL}/organizadores`);
    return this._handleResponse(response);
  },

  async getOrganizerById(organizerId) {
    const response = await fetch(`${API_URL}/organizadores/${organizerId}`);
    return this._handleResponse(response);
  },

  async getOrganizerEvents(organizerId) {
    const response = await fetch(
      `${API_URL}/organizadores/${organizerId}/eventos`
    );
    return this._handleResponse(response);
  },

  async checkIsFavorite(organizerId) {
    try {
      const token = storage.getToken();
      if (!token) {
        return { is_favorite: false };
      }

      const response = await fetch(
        `${API_URL}/organizadores/${organizerId}/es-favorito`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return this._handleResponse(response);
    } catch (error) {
      return { is_favorite: false };
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
    return {
      status: response.status,
      statusText: response.statusText,
      message: `HTTP error! status: ${response.status}`,
      errors: errorData,
    };
  },
};
