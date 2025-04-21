export async function logout(router) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (token) {
    try {
      await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (e) {
      // Ignorar errores de red
    }
    localStorage.removeItem('access_token');
  }
  if (router) {
    router.replace('/auth/login');
  } else if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
}
