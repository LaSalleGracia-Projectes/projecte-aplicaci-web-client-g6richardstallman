import { storage } from "../utils/storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

let cachedUserPromise = null;
const CACHE_DURATION = 60000; // 1 minute
let lastFetchTime = 0;

export const userService = {
  // Obtiene el usuario autenticado (endpoint /user, solo datos básicos)
  async getUser() {
    const token = storage.getToken(true) || storage.getToken(false);
    if (!token) throw new Error("No authorization token found");

    const response = await fetch(`${API_URL}/user`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    return this._handleResponse(response);
  },

  // Obtiene el perfil completo (endpoint /profile)
  async getProfile() {
    const now = Date.now();
    const hasRecentCache = (now - lastFetchTime) < CACHE_DURATION;

    if (cachedUserPromise && hasRecentCache) {
      try {
        return await cachedUserPromise;
      } catch {
        cachedUserPromise = null;
      }
    }

    const token = storage.getToken(true) || storage.getToken(false);
    if (!token) throw new Error("No authorization token found");

    lastFetchTime = now;
    cachedUserPromise = fetch(`${API_URL}/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 }
    })
      .then(resp => this._handleResponse(resp))
      .then(data => {
        const isPersistent = !!storage.getToken(true);
        storage.set("user_info", data.data || data, isPersistent);
        return data;
      })
      .catch(err => {
        cachedUserPromise = null;
        throw err;
      });

    return cachedUserPromise;
  },

  // Obtiene solo el avatar del usuario autenticado
  async getAvatar() {
    const token = storage.getToken(true) || storage.getToken(false);
    if (!token) throw new Error("No authorization token found");

    const response = await fetch(`${API_URL}/avatar`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 }
    });

    return this._handleResponse(response);
  },

  // Actualiza el perfil del usuario
  async updateProfile(userData) {
    cachedUserPromise = null;

    const token = storage.getToken(true) || storage.getToken(false);
    if (!token) throw new Error("No authorization token found");

    const response = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await this._handleResponse(response);
    const isPersistent = !!storage.getToken(true);
    storage.set("user_info", data.data || data, isPersistent);
    return data;
  },

  // Cambia la contraseña del usuario
  async changePassword(passwordData) {
    const token = storage.getToken(true) || storage.getToken(false);
    if (!token) throw new Error("No authorization token found");

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

  // Elimina la cuenta del usuario autenticado
  async deleteAccount(confirmationData) {
    const token = storage.getToken(true) || storage.getToken(false);
    if (!token) throw new Error("No authorization token found");

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

  // Obtiene el usuario almacenado localmente
  getStoredUserInfo() {
    return storage.get("user_info", null, true) || storage.get("user_info", null, false);
  },

  // Almacena el usuario localmente
  storeUserInfo(user, persistent = false) {
    if (!user) return;
    const isPersistent = !!storage.getToken(true);
    storage.set("user_info", user, isPersistent || persistent);
  },

  // Limpia el usuario almacenado localmente
  clearUserInfo() {
    cachedUserPromise = null;
    storage.remove("user_info", false);
    storage.remove("user_info", true);
  },

  // Fusiona datos nuevos con los almacenados
  mergeUserInfo(newData) {
    const currentData = this.getStoredUserInfo();
    if (!currentData) return newData;

    const isPersistent = !!storage.getToken(true);
    const mergedData = { ...currentData, ...newData };
    this.storeUserInfo(mergedData, isPersistent);

    return mergedData;
  },

  // Manejo de respuesta estándar
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
