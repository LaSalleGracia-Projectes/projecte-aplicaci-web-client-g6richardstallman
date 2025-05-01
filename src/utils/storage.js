export const storage = {
  set(key, value, persistent = false) {
    try {
      const serializedValue = JSON.stringify(value);
      if (persistent) {
        localStorage.setItem(key, serializedValue);
      } else {
        sessionStorage.setItem(key, serializedValue);
      }
    } catch (error) {
      console.error("Error storing data:", error);
    }
  },

  get(key, defaultValue = null, persistent = false) {
    try {
      const storage = persistent ? localStorage : sessionStorage;
      const value = storage.getItem(key);
      if (value === null) {
        return defaultValue;
      }
      return JSON.parse(value);
    } catch (error) {
      console.error("Error retrieving data:", error);
      return defaultValue;
    }
  },

  remove(key, persistent = false) {
    try {
      if (persistent) {
        localStorage.removeItem(key);
      } else {
        sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error("Error removing data:", error);
    }
  },

  setToken(token, persistent = false) {
    this.set("auth_token", token, persistent);
  },

  getToken(persistent = false) {
    return this.get("auth_token", null, persistent);
  },

  removeToken(persistent = false) {
    this.remove("auth_token", persistent);
    this.remove("auth_token", !persistent);
  },

  clearAll() {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  },
};
