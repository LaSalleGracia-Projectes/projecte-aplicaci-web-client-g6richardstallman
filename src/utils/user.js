// Utilitats per gestionar l'usuari al localStorage

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('user_info');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user_info', JSON.stringify(user));
}

export function clearStoredUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user_info');
}
