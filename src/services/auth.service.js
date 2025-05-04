import { storage } from "../utils/storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const authService = {
  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await this._handleResponse(response);

      if (data.token) {
        storage.setToken(data.token, false);
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  async login(credentials, remember = false) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await this._handleResponse(response);

      if (data.access_token) {
        storage.setToken(data.access_token, remember);
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      const token = storage.getToken(false) || storage.getToken(true);
      if (!token) {
        this.cleanupLocalData();
        return { status: "success", message: "No active session" };
      }

      try {
        const response = await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });

        const data = await this._handleResponse(response);
        this.cleanupLocalData();
        return data;
      } catch (error) {
        this.cleanupLocalData();
        return { status: "success", message: "Session closed" };
      }
    } catch (error) {
      this.cleanupLocalData();
      return { status: "success", message: "Session closed" };
    }
  },

  cleanupLocalData() {
    storage.removeToken(false);
    storage.removeToken(true);
    storage.remove("user_info", false);
    storage.remove("user_info", true);
  },

  async resetPassword(email, identificador) {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, identificador }),
    });

    return this._handleResponse(response);
  },

  isAuthenticated() {
    return !!(storage.getToken(false) || storage.getToken(true));
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
