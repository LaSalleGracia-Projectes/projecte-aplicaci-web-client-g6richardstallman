import { storage } from "../utils/storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const googleAuthService = {
  async getAuthUrl() {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: "GET",
    });

    const data = await this._handleResponse(response);
    return data.url;
  },

  async handleCallback(code) {
    const response = await fetch(
      `${API_URL}/auth/google/callback?code=${code}`,
      {
        method: "GET",
      }
    );

    const data = await this._handleResponse(response);

    if (data.token) {
      storage.setToken(data.token, false);

      if (data.user) {
        storage.set("user_info", data.user, false);
      }
    }

    return data;
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
