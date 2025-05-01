import { storage } from "../utils/storage";

const API_URL = "http://localhost:8000/api";

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

      // Simplemente devolvemos la respuesta, sin almacenar token ni datos
      return this._handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  async login(credentials) {
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
        // Guardamos explícitamente en sessionStorage (true)
        storage.setToken(data.access_token, true);
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      const token = storage.getToken(true);
      if (!token) return { status: "success", message: "Ya cerrado sesión" };

      const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await this._handleResponse(response);

      storage.removeToken();
      storage.remove("user_info");

      return data;
    } catch (error) {
      storage.removeToken();
      storage.remove("user_info");
      throw error;
    }
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

  redirectToLogin(router) {
    if (router) {
      router.replace("/auth/login");
    } else if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  },

  isAuthenticated() {
    // Verificamos siempre en sessionStorage (true)
    return !!storage.getToken(true);
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
