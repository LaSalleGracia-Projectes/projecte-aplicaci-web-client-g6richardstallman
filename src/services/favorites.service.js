import { storage } from "../utils/storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const favoritesService = {
  async getFavoriteEvents() {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No authorization token found");
    }

    const response = await fetch(`${API_URL}/favoritos`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return this._handleResponse(response);
  },

  async addToFavorites(eventId) {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No authorization token found");
    }

    const response = await fetch(`${API_URL}/favoritos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idEvento: eventId }),
    });

    return this._handleResponse(response);
  },

  async removeFromFavorites(eventId) {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No authorization token found");
    }

    const response = await fetch(`${API_URL}/favoritos/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return this._handleResponse(response);
  },

  async checkIsFavorite(eventId) {
    try {
      const token = storage.getToken();
      if (!token) {
        return { isFavorito: false };
      }

      const response = await fetch(`${API_URL}/favoritos/check/${eventId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return this._handleResponse(response);
    } catch (error) {
      return { isFavorito: false };
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
