"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaHome, FaGoogle, FaFacebook, FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { login } from "../../api/auth";

function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await login(formData);
      
      if (response.status === "success") {
        router.push("/");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Error al iniciar sesión");
      } else {
        setError("Error al conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setSocialLoading(provider);
      
      // Esta sería la implementación real que redirigiría al endpoint OAuth
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/${provider}`;
      
    } catch (error) {
      setError(`Error al iniciar sesión con ${provider}`);
      setSocialLoading("");
    }
  };

  // Limpiar errores después de 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Panel lateral con imagen */}
      <div className="hidden md:block md:w-1/2 lg:w-2/5 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
        <img
          src="/registerImage.jpg"
          alt="Imagen de login"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-8 left-8 right-8 text-white z-20">
          <h2 className="text-2xl lg:text-3xl font-bold mb-2">¡Bienvenido de nuevo!</h2>
          <p className="text-sm lg:text-base opacity-90">Accede a tu cuenta para descubrir eventos increíbles</p>
        </div>
      </div>

      {/* Formulario */}
      <div className="w-full md:w-1/2 lg:w-3/5 flex flex-col justify-center items-center min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-10 relative overflow-y-auto">
        {/* Botón de inicio */}
        <Link
          href="/"
          className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-2 bg-black text-white rounded-full hover:bg-gray-800 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-md"
        >
          <FaHome className="text-lg" />
          <span className="text-sm font-medium md:inline hidden">Inicio</span>
        </Link>

        {/* Logo */}
        <div className="mb-6 sm:mb-8 mt-12 md:mt-0 transform hover:scale-[1.05] transition-transform duration-300">
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

        {/* Mensaje de error */}
        {error && (
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg shadow-sm animate-fadeIn">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Formulario de login */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-md sm:max-w-lg md:max-w-xl border-b border-gray-200 gap-4 sm:gap-5 pb-8">
          <div className="w-full">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
              className="w-full p-3 border-2 border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 transition-all duration-200"
              required
            />
          </div>
          
          <div className="w-full">
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              className="w-full p-3 border-2 border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 transition-all duration-200"
              required
            />
          </div>

          {/* Link de olvido de contraseña */}
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
                <FaSpinner className="animate-spin mr-2" />
                Iniciando sesión...
              </span>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        {/* Botones de redes sociales */}
        <div className="flex flex-col items-center w-full max-w-md sm:max-w-lg md:max-w-xl mt-6 sm:mt-8">
          <p className="text-sm text-gray-500 mb-4">O inicia sesión con</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
            <button 
              onClick={() => handleSocialLogin('google')}
              disabled={socialLoading === 'google'}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transform hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 shadow-sm ${socialLoading === 'google' ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {socialLoading === 'google' ? (
                <FaSpinner className="animate-spin text-red-500 text-xl" />
              ) : (
                <FaGoogle className="text-xl text-red-500" />
              )}
              <span className="text-sm sm:text-base font-medium">Google</span>
            </button>

            <button 
              onClick={() => handleSocialLogin('facebook')}
              disabled={socialLoading === 'facebook'}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transform hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 shadow-sm ${socialLoading === 'facebook' ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {socialLoading === 'facebook' ? (
                <FaSpinner className="animate-spin text-blue-600 text-xl" />
              ) : (
                <FaFacebook className="text-xl text-blue-600" />
              )}
              <span className="text-sm sm:text-base font-medium">Facebook</span>
            </button>
          </div>
        </div>

        {/* Link de registro - versión mejorada y más visible */}
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
  );
}

export default Login;
