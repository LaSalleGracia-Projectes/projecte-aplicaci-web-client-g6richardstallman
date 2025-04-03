"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import Image from "next/image";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [scrollPosition, setScrollPosition] = useState(0);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password === formData.confirmPassword) {
      console.log("Contraseña actualizada");
    } else {
      console.log("Las contraseñas no coinciden");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Imagen lateral - adaptable según tamaño de pantalla */}
      <div className="hidden md:block md:w-1/2 lg:w-2/5 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
        <img
          src="/registerImage.jpg"
          alt="Imagen de recuperación"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenedor del formulario - adaptable a diferentes tamaños */}
      <div className="w-full md:w-1/2 lg:w-3/5 flex flex-col h-screen overflow-hidden">
        {/* Barra superior fija con botón de inicio */}
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
        
        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 flex flex-col items-center">
          {/* Logo responsivo - sin hover */}
          <div className="mb-4 sm:mb-6">
            <Image
              src="/logo.jpg"
              alt="EventFlix Logo"
              width={150}
              height={60}
              className="object-contain"
              priority
            />
          </div>

          <h1 className="text-center mb-4 font-extrabold text-2xl sm:text-2xl md:text-3xl">
            Establece tu nueva contraseña
          </h1>

          <p className="text-center text-sm md:text-base mb-6 px-4 md:px-0 max-w-md text-gray-600">
            Introduce una nueva contraseña segura para tu cuenta
          </p>

          {/* Formulario de reset mejorado */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center w-full max-w-md sm:max-w-lg md:max-w-xl border-b border-gray-300 gap-3 sm:gap-4 pb-8"
          >
            <div className="w-full mb-3">
              <label className="block text-gray-700 text-sm font-medium mb-2 pl-1">
                Nueva contraseña*
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Introduce tu nueva contraseña"
                required
                className="w-full p-3 border-2 border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 hover:border-gray-400 active:border-gray-500 transition-all duration-200"
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700 text-sm font-medium mb-2 pl-1">
                Confirmar contraseña*
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirma tu nueva contraseña"
                required
                className="w-full p-3 border-2 border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 hover:border-gray-400 active:border-gray-500 transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              className="w-fit mt-4 px-8 sm:px-12 py-2.5 sm:py-3 bg-black text-white rounded-md font-medium cursor-pointer hover:bg-gray-800 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 shadow-md text-sm sm:text-base"
            >
              Actualizar contraseña
            </button>
          </form>

          {/* Link para volver al login mejorado */}
          <p className="mt-6 mb-8 text-sm sm:text-base">
            <Link
              href="/login"
              className="text-[#e53c3d] hover:text-[#c93131] transition-colors font-medium flex items-center justify-center gap-2 px-4 py-2 rounded-md hover:bg-red-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al inicio de sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
