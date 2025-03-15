const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tu-api.com/api';

// Función para registrar un nuevo usuario
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en registro:", error);
    throw error;
  }
};

// Función para iniciar sesión
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en inicio de sesión:", error);
    throw error;
  }
};

// Función para obtener los datos del perfil de usuario
export const getUserProfile = async () => {
  try {
    // Obtener el token almacenado en localStorage
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    const token = userInfo.token;
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener el perfil');
    }
    
    const data = await response.json();
    
    return {
      status: "success",
      data
    };
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    throw error;
  }
};

// Función para actualizar los datos del perfil
export const updateProfile = async (profileData) => {
  const userStorage = localStorage.getItem('user');
  const user = userStorage ? JSON.parse(userStorage) : null;
  const token = user?.token;
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }
  
  try {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      throw new Error('Error al actualizar el perfil');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    throw error;
  }
}; 