export const storage = {
  set(key, value) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error al guardar en localStorage (${key}):`, e);
    }
  },

  get(key, defaultValue = null) {
    if (typeof window === "undefined") return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Error al leer de localStorage (${key}):`, e);
      return defaultValue;
    }
  },

  remove(key) {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },

  getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  },

  setToken(token) {
    if (typeof window === "undefined") return;
    localStorage.setItem("access_token", token);
  },

  removeToken() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("access_token");
  }
};
