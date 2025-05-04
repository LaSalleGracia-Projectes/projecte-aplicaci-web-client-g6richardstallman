import { storage } from "../utils/storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const organizerFavoritesService = {
  async getFavoriteOrganizers() {
    try {
      const token = storage.getToken(false) || storage.getToken(true);
      if (!token) {
        throw new Error("No authorization token found");
      }

      const response = await fetch(`${API_URL}/organizadores-favoritos`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        cache: 'no-store'
      });

      return this._handleResponse(response);
    } catch (error) {
      console.error("Error getting favorite organizers:", error);
      throw error;
    }
  },

  async addToFavorites(organizerId) {
    try {
      const token = storage.getToken();
      if (!token) {
        throw new Error("No authorization token found");
      }

      const response = await fetch(`${API_URL}/organizadores-favoritos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ idOrganizador: organizerId }),
      });

      return this._handleResponse(response);
    } catch (error) {
      console.error("Error adding organizer to favorites:", error);
      throw error;
    }
  },

  async removeFromFavorites(organizerId) {
    try {
      const token = storage.getToken();
      if (!token) {
        throw new Error("No authorization token found");
      }

      const response = await fetch(
        `${API_URL}/organizadores-favoritos/${organizerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      return this._handleResponse(response);
    } catch (error) {
      console.error("Error removing organizer from favorites:", error);
      throw error;
    }
  },

  async checkIsFavorite(organizerId) {
    try {
      const token = storage.getToken();
      if (!token) {
        return { is_favorite: false };
      }

      const response = await fetch(
        `${API_URL}/organizadores-favoritos/check/${organizerId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      return this._handleResponse(response);
    } catch (error) {
      console.error("Error checking if organizer is favorite:", error);
      return { is_favorite: false };
    }
  },

  async _handleResponse(response) {
    if (!response.ok) {
      const errorData = await this._parseErrorResponse(response);
      throw this._formatErrorResponse(response, errorData);
    }

    try {
      const data = await response.json();
      if (data.favoritos) {
        return {
          data: {
            favoritos: data.favoritos
          },
          message: data.message || "Success",
          status: data.status || "success"
        };
      }
      return data;
    } catch (e) {
      if (response.status === 204) {
        return { data: { favoritos: [] }, status: "success" };
      }
      throw new Error("Invalid JSON response from server");
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
