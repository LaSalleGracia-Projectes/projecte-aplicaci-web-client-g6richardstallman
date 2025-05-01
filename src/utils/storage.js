export const storage = {
  set(key, value, useSession = true) {
    if (typeof window === "undefined") return;
    try {
      const storageMethod = useSession ? sessionStorage : localStorage;
      storageMethod.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(
        `Error al guardar en ${
          useSession ? "sessionStorage" : "localStorage"
        } (${key}):`,
        e
      );
    }
  },

  get(key, defaultValue = null, useSession = true) {
    if (typeof window === "undefined") return defaultValue;
    try {
      const storageMethod = useSession ? sessionStorage : localStorage;
      const item = storageMethod.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(
        `Error al leer de ${
          useSession ? "sessionStorage" : "localStorage"
        } (${key}):`,
        e
      );
      return defaultValue;
    }
  },

  remove(key, useSession = true) {
    if (typeof window === "undefined") return;
    const storageMethod = useSession ? sessionStorage : localStorage;
    storageMethod.removeItem(key);
  },

  getToken(useSession = true) {
    if (typeof window === "undefined") return null;
    const storageMethod = useSession ? sessionStorage : localStorage;
    return storageMethod.getItem("access_token");
  },

  setToken(token, useSession = true) {
    if (typeof window === "undefined") return;
    const storageMethod = useSession ? sessionStorage : localStorage;
    storageMethod.setItem("access_token", token);
  },

  removeToken(useSession = true) {
    if (typeof window === "undefined") return;
    const storageMethod = useSession ? sessionStorage : localStorage;
    storageMethod.removeItem("access_token");
  },
};
