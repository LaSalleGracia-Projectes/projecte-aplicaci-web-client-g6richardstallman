import { storage } from "../utils/storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const userService = {
  async getUser() {
    const token = storage.getToken(false);
    if (!token) {
      throw new Error("No authorization token found");
    }

    const response = await fetch(`${API_URL}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return this._handleResponse(response);
  },

  async getProfile() {
    const token = storage.getToken(false) || storage.getToken(true);
    if (!token) {
      throw new Error("No authorization token found");
    }

    const response = await fetch(`${API_URL}/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await this._handleResponse(response);
    const isPersistent = storage.getToken(true) ? true : false;
    storage.set("user_info", data.data || data, isPersistent);
    return data;
  },

  async updateProfile(userData) {
    const token = storage.getToken(false);
    if (!token) {
      throw new Error("No authorization token found");
    }

    const response = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await this._handleResponse(response);
    storage.set("user_info", data.data || data, false);
    return data;
  },

  async changePassword(passwordData) {
    const token = storage.getToken(false);
    if (!token) {
      throw new Error("No authorization token found");
    }

    const response = await fetch(`${API_URL}/change-password`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwordData),
    });

    return this._handleResponse(response);
  },

  async deleteAccount(confirmationData) {
    const token = storage.getToken(false);
    if (!token) {
      throw new Error("No authorization token found");
    }

    const response = await fetch(`${API_URL}/account`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: confirmationData.password,
        confirm_deletion: true,
      }),
    });

    return this._handleResponse(response);
  },

  getStoredUserInfo() {
    return storage.get("user_info", null, false) || storage.get("user_info", null, true);
  },

  storeUserInfo(user, persistent = false) {
    storage.set("user_info", user, persistent);
  },

  clearUserInfo() {
    storage.remove("user_info", false);
    storage.remove("user_info", true);
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
