"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaHome, FaGoogle, FaFacebook } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { showSuccessToast, showErrorToast } from '../../utils/toastNotifications';

function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (formErrors[e.target.name]) {
        setFormErrors(prev => {
          const newErrors = {...prev};
          delete newErrors[e.target.name];
          return newErrors;
        });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) errors.email = "El email es obligatorio";
    if (!formData.password) errors.password = "La contraseña es obligatoria";
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Por favor, introduce un email válido";
    }
    
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
        showErrorToast("Por favor, completa los campos requeridos.");
    }
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
       const response = { status: "success", access_token: "dummy_token", user: { id: 1, name: "Usuario" } };
       if (formData.email !== 'test@test.com' || formData.password !== 'password') {
          response.status = "error";
          response.message = "Credenciales inválidas (simulado)";
       }
       await new Promise(res => setTimeout(res, 500));
      
      if (response && response.status === "success") {
        localStorage.setItem('user', JSON.stringify({
          isLoggedIn: true,
          token: response.access_token,
          userData: response.user
        }));
        showSuccessToast("¡Inicio de sesión exitoso!");
        router.push('/profile');
      } else {
        showErrorToast(response?.message || "Credenciales inválidas");
      }
    } catch (error) {
      showErrorToast("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setSocialLoading(provider);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      window.location.href = `${apiUrl}/auth/${provider}`;
      
    } catch (error) {
      showErrorToast(`Error al iniciar sesión con ${provider}`);
      setSocialLoading("");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const position = document.querySelector('.overflow-y-auto')?.scrollTop;
      setScrollPosition(position || 0);
    };
    
    const scrollContainer = document.querySelector('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-white to-gray-50">
      <div className="hidden md:block md:w-1/2 lg:w-2/5 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
        <img
          src="/registerImage.jpg"
          alt="Imagen de login"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-8 left-8 right-8 text-white z-20">
          <h2 className="text-2xl lg:text-3xl font-bold mb-2 bg-black/40 p-2 rounded-lg inline-block">¡Bienvenido de nuevo!</h2>
          <p className="text-sm lg:text-base opacity-90 bg-black/40 p-2 rounded-lg inline-block">Accede a tu cuenta para descubrir eventos increíbles</p>
        </div>
      </div>

      <div className="w-full md:w-1/2 lg:w-3/5 flex flex-col h-screen overflow-hidden">
        <div 
          className="flex justify-between items-center p-4 bg-white/90 backdrop-blur-sm z-30 sticky top-0 transition-shadow duration-200"
          style={{
            boxShadow: scrollPosition > 10 ? "0 2px 4px rgba(0,0,0,0.05)" : "none"
          }}
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded-full hover:bg-gray-800 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-md"
          >
            <FaHome className="text-lg" />
            <span className="text-sm font-medium md:inline hidden">Inicio</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 flex flex-col items-center">
          <div className="mb-6 sm:mb-8">
            <div
              className="w-[130px] h-[52px] sm:w-[150px] sm:h-[60px]"
              style={{
                backgroundImage: 'url("/logo.jpg")',
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
          </div>

          <h1 className="text-center mb-6 font-extrabold text-2xl sm:text-3xl md:text-4xl text-black">
            Inicia Sesión
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-md sm:max-w-lg md:max-w-xl border-b border-gray-200 gap-4 sm:gap-5 pb-8">
            <div className="w-full">
              <label className="block text-gray-700 text-sm font-medium mb-2 pl-1">
                Email*
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Introduce tu email"
                className={`w-full p-3 border-2 ${
                  formErrors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 hover:border-gray-400 active:border-gray-500 transition-all duration-200`}
                required
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs italic mt-1">{formErrors.email}</p>
              )}
            </div>
            
            <div className="w-full">
              <label className="block text-gray-700 text-sm font-medium mb-2 pl-1">
                Contraseña*
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Introduce tu contraseña"
                className={`w-full p-3 border-2 ${
                  formErrors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 hover:border-gray-400 active:border-gray-500 transition-all duration-200`}
                required
              />
            </div>

            <div className="w-full flex justify-end mb-2">
              <Link
                href="/login/forgot-password"
                className="text-sm text-gray-600 hover:text-[#e53c3d] transition-all hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-[#e53c3d] text-white rounded-lg font-medium cursor-pointer hover:bg-[#d02e2f] transform hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          <div className="flex flex-col items-center w-full max-w-md sm:max-w-lg md:max-w-xl mt-6 sm:mt-8">
            <p className="text-sm text-gray-500 mb-4">O inicia sesión con</p>

            <div className="flex flex-row space-x-4 justify-center w-full max-w-sm">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={socialLoading === 'google'}
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 hover:border-gray-400 hover:shadow-sm hover:scale-[1.01] active:scale-[0.98]"
              >
                {socialLoading === 'google' ? (
                  "Cargando..."
                ) : (
                  <FaGoogle className="text-red-500" />
                )}
                <span>Google</span>
              </button>
              
              <button
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                disabled={socialLoading === 'facebook'}
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 hover:border-gray-400 hover:shadow-sm hover:scale-[1.01] active:scale-[0.98]"
              >
                {socialLoading === 'facebook' ? (
                  "Cargando..."
                ) : (
                  <FaFacebook className="text-blue-600" />
                )}
                <span>Facebook</span>
              </button>
            </div>
          </div>

          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl mt-8 mb-8 p-4 text-center bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-sm sm:text-base">
              ¿Aún no estás registrado?{" "}
              <Link
                href="/register"
                className="text-[#e53c3d] hover:text-[#c93131] transition-colors font-medium hover:underline"
              >
                Registrarse ahora
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
