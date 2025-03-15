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
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (!response.ok) {
            const error: any = new Error(responseData.message || 'Error en el registro');
            error.response = { data: responseData };
            throw error;
        }

        // Si el registro fue exitoso, guardamos el token en localStorage
        if (responseData.access_token) {
            localStorage.setItem('auth_token', responseData.access_token);
            localStorage.setItem('user_data', JSON.stringify(responseData.user));
        }

        return responseData;
    } catch (error) {
        console.error('Error de registro:', error);
        throw error;
    }
}

// Función para iniciar sesión
export async function login(data: LoginData) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (!response.ok) {
            const error: any = new Error(responseData.message || 'Error al iniciar sesión');
            error.response = { data: responseData };
            throw error;
        }

        // Si el login fue exitoso, guardamos el token en localStorage
        if (responseData.access_token) {
            localStorage.setItem('auth_token', responseData.access_token);
            localStorage.setItem('user_data', JSON.stringify(responseData.user));
        }

        return responseData;
    } catch (error) {
        console.error('Error de inicio de sesión:', error);
        throw error;
    }
}

// Función para cerrar sesión
export async function logout() {
    try {
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
            throw new Error('No hay sesión activa');
        }

        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Error al cerrar sesión');
        }

        // Limpiar datos de sesión del localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');

        return responseData;
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
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
