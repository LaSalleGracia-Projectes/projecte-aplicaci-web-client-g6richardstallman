import { storage } from "../utils/storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const googleAuthService = {
  // Obtener la URL de autenticación de Google
  async getAuthUrl() {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: "GET",
    });

    const data = await this._handleResponse(response);
    return data.url;
  },

  // Completar el registro web con Google
  async completeWebRegistration(userData) {
    const response = await fetch(`${API_URL}/auth/google/web`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await this._handleResponse(response);
    return data;
  },

  // Guardar token y datos de usuario después del login exitoso con Google
  saveUserSession(data, persistent = true) {
    if (data.token) {
      storage.setToken(data.token, persistent);
      if (data.user) {
        storage.set("user_info", data.user, persistent);
      }
      return true;
    }
    return false;
  },

  // Obtener los datos de usuario guardados
  getUserData() {
    return storage.get("user_info", null, true);
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
      message: errorData.message || `HTTP error! status: ${response.status}`,
      errors: errorData,
    };
  },
};
