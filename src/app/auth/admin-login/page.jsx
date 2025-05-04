'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './admin-login.css';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking', 'online', 'offline'
  const router = useRouter();

  // Define API base URL with fallback for missing env variable
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  // Check server status on component mount
  useEffect(() => {
    checkServerStatus();
  }, []);

  // Check if the backend server is available
  const checkServerStatus = async () => {
    try {
      // Use a simple GET request to check if the server is reachable
      // We use a timeout to avoid waiting too long
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      await fetch(`${API_BASE_URL}/eventos?limit=1`, { 
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      setServerStatus('online');
    } catch (err) {
      console.error('Server connection check failed:', err);
      setServerStatus('offline');
      setError('No se pudo conectar con el servidor. Asegúrate de que el backend esté ejecutándose en ' + API_BASE_URL);
    }
  };

  useEffect(() => {
    // Only check for logged-in admin if server is online
    if (serverStatus === 'online') {
      const token = localStorage.getItem('token');
      if (token) {
        fetch(`${API_BASE_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Verificación fallida');
          }
          return response.json();
        })
        .then(data => {
          if (data.role === 'admin') {
            router.push('/dashboard');
          }
        })
        .catch(err => {
          localStorage.removeItem('token');
        });
      }
    }
  }, [router, API_BASE_URL, serverStatus]);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (serverStatus === 'offline') {
      setError('No se puede iniciar sesión porque el servidor no está disponible. Verifica que el backend esté en ejecución.');
      setIsLoading(false);
      return;
    }

    try {
      // Use direct API URL with fallback
      const response = await fetch(
        `${API_BASE_URL}/login`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
      
      if (data.user && data.user.role === 'admin') {
        localStorage.setItem('token', data.access_token || data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError('Acceso denegado. Solo administradores pueden acceder.');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle network errors specifically
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setError(
          'Error de conexión al servidor. Por favor, verifica que el backend esté en ejecución en ' + 
          API_BASE_URL + '. Si estás ejecutando localmente, revisa que el comando "php artisan serve" esté corriendo.'
        );
        setServerStatus('offline');
      } else {
        setError(
          err.message || 
          'Error al iniciar sesión. Verifica tus credenciales.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h1>Panel de Administración</h1>
        <h2>Iniciar sesión</h2>
        
        {serverStatus === 'offline' && (
          <div className="admin-login-warning">
            <h3>Servidor no disponible</h3>
            <p>No se puede conectar con el servidor API en: <strong>{API_BASE_URL}</strong></p>
            <p>Verifica que:</p>
            <ul>
              <li>El servidor backend esté ejecutándose</li>
              <li>La URL de la API sea correcta</li>
              <li>No haya problemas de red o firewall</li>
            </ul>
            <button 
              onClick={checkServerStatus} 
              className="retry-button"
              disabled={isLoading}
            >
              Reintentar conexión
            </button>
          </div>
        )}
        
        {error && <div className="admin-login-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={credentials.email}
              onChange={handleChange}
              required
              disabled={serverStatus === 'offline' || isLoading}
            />
          </div>
          
          <div className="admin-form-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={credentials.password}
              onChange={handleChange}
              required
              disabled={serverStatus === 'offline' || isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="admin-login-button" 
            disabled={serverStatus === 'offline' || isLoading}
          >
            {isLoading ? 'Cargando...' : 'Acceder'}
          </button>
        </form>
        
        {/* Display server connection status */}
        <div className="server-status">
          Estado del servidor: 
          {serverStatus === 'checking' && <span className="status checking"> Comprobando...</span>}
          {serverStatus === 'online' && <span className="status online"> Conectado</span>}
          {serverStatus === 'offline' && <span className="status offline"> Desconectado</span>}
        </div>
      </div>
    </div>
  );
}
