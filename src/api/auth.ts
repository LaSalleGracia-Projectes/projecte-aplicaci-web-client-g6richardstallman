// Servicio de autenticación para interactuar con el backend

// URL base de la API - usar variable de entorno o fallback a localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Interfaz para los datos de registro
export interface RegisterData {
    nombre: string;
    apellido1: string;
    apellido2?: string;
    email: string;
    password: string;
    role: 'organizador' | 'participante';
    // Campos específicos del organizador
    nombre_organizacion?: string;
    telefono_contacto?: string;
    // Campos específicos del participante
    dni?: string;
    telefono?: string;
}

// Interfaz para los datos de inicio de sesión
export interface LoginData {
    email: string;
    password: string;
}

// Función para registrar un nuevo usuario
export async function register(data: RegisterData) {
    try {
        console.log("Enviando solicitud de registro:", data);
        
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        console.log("Respuesta del registro:", responseData);

        if (!response.ok) {
            console.error("Error en el registro:", responseData);
            const error: any = new Error(responseData.message || 'Error en el registro');
            error.response = { data: responseData };
            throw error;
        }

        return {
            status: "success",
            access_token: responseData.access_token,
            user: responseData.user,
            message: responseData.message
        };
    } catch (error) {
        console.error('Error en la función register:', error);
        throw error;
    }
}

// Función para iniciar sesión
export async function login(credentials: { email: string, password: string }) {
    try {
        console.log("Enviando solicitud de login:", credentials);
        
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const responseData = await response.json();
        console.log("Respuesta del login:", responseData);

        if (!response.ok) {
            console.error("Error en el login:", responseData);
            const error: any = new Error(responseData.message || 'Error en el inicio de sesión');
            error.response = { data: responseData };
            throw error;
        }

        return {
            status: "success",
            access_token: responseData.access_token,
            user: responseData.user,
            message: responseData.message
        };
    } catch (error) {
        console.error('Error en la función login:', error);
        throw error;
    }
}

// Función para cerrar sesión
export async function logout() {
    try {
        const userInfo = typeof window !== 'undefined' ? 
            JSON.parse(localStorage.getItem('user') || '{}') : {};
        const token = userInfo.token;
        
        if (!token) {
            throw new Error('No hay token de autenticación');
        }
        
        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al cerrar sesión');
        }
        
        // Limpiar localStorage
        localStorage.removeItem('user');
        
        return {
            status: "success",
            message: "Sesión cerrada correctamente"
        };
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        // Intentar limpiar localStorage de todos modos
        localStorage.removeItem('user');
        throw error;
    }
}

// Función para verificar si el usuario está autenticado
export function isAuthenticated() {
    return localStorage.getItem('auth_token') !== null;
}

// Función para obtener el usuario actual
export function getCurrentUser() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
}

// Función para obtener el token de autenticación
export function getAuthToken() {
    return localStorage.getItem('auth_token');
}

// Función para obtener los datos del perfil de usuario
export async function getUserProfile() {
    try {
        // Obtener el token almacenado en localStorage
        const userInfo = typeof window !== 'undefined' ? 
            JSON.parse(localStorage.getItem('user') || '{}') : {};
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
}

// Función para actualizar el perfil de usuario
export async function updateUserProfile(userData: any) {
    try {
        // Obtener el token almacenado en localStorage
        const userInfo = typeof window !== 'undefined' ? 
            JSON.parse(localStorage.getItem('user') || '{}') : {};
        const token = userInfo.token;
        
        if (!token) {
            throw new Error('No hay token de autenticación');
        }
        
        const response = await fetch(`${API_URL}/user/profile/update`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al actualizar el perfil');
        }
        
        // Actualizar la información del usuario en localStorage
        if (typeof window !== 'undefined') {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({
                ...currentUser,
                userData: {
                    ...currentUser.userData,
                    ...userData
                }
            }));
        }
        
        return {
            status: "success",
            message: data.message || "Perfil actualizado correctamente",
            data: data.user
        };
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        throw error;
    }
}
