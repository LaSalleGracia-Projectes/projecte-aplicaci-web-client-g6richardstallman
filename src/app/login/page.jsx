"use client";

import React from "react";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import Image from "next/image";

function Login() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Imagen lateral - adaptable según tamaño de pantalla */}
      <div className="hidden md:block md:w-1/2 lg:w-2/5 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
        <img
          src="/registerImage.jpg"
          alt="Imagen de login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenedor del formulario - adaptable a diferentes tamaños */}
      <div className="w-full md:w-1/2 lg:w-3/5 flex flex-col justify-center items-center min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-10 relative overflow-y-auto">
        {/* Botón de inicio mejorado */}
        <Link
          href="/"
          className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-2 bg-black text-white rounded-full hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md"
        >
          <FaHome className="text-lg" />
          <span className="text-sm font-medium md:inline hidden">Inicio</span>
        </Link>

        {/* Logo responsivo */}
        <div className="mb-4 sm:mb-6 mt-8 md:mt-0">
          <div
            className="w-[120px] h-[48px] sm:w-[140px] sm:h-[55px]"
            style={{
              backgroundImage: 'url("/logo.webp")',
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
        </div>

        <h1 className="text-center mb-6 font-extrabold text-2xl sm:text-2xl md:text-3xl">
          Inicia Sesión
        </h1>

        {/* Formulario de login mejorado */}
        <form className="flex flex-col items-center w-full max-w-md sm:max-w-lg md:max-w-xl border-b border-gray-300 gap-3 sm:gap-4 pb-8">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Correo electrónico"
            className="w-full p-2.5 border-2 border-gray-400 rounded-md placeholder-gray-500 focus:outline-none focus:border-[#e53c3d] focus:ring-1 focus:ring-[#e53c3d] transition-all duration-200"
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Contraseña"
            className="w-full p-2.5 border-2 border-gray-400 rounded-md placeholder-gray-500 focus:outline-none focus:border-[#e53c3d] focus:ring-1 focus:ring-[#e53c3d] transition-all duration-200"
          />

          {/* Link de olvido de contraseña alineado a la derecha */}
          <div className="w-full flex justify-end">
            <Link
              href="/login/forgot-password"
              className="text-sm text-gray-600 hover:text-[#e53c3d] transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            className="w-fit mt-4 px-8 sm:px-12 py-2.5 sm:py-3 bg-black text-white rounded-md font-medium cursor-pointer hover:bg-gray-800 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 shadow-md text-sm sm:text-base"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Botones de inicio de sesión social mejorados */}
        <div className="flex flex-col items-center w-full max-w-md sm:max-w-lg md:max-w-xl mt-6 sm:mt-8">
          <p className="text-sm text-gray-500 mb-3">O inicia sesión con</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 border border-gray-300 rounded-md hover:bg-gray-50 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 shadow-sm">
              <img
                src="/googleIcon.png"
                alt="Icono de Google"
                className="w-4 sm:w-5 h-4 sm:h-5"
              />
              <span className="text-sm sm:text-base">Google</span>
            </button>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 border border-gray-300 rounded-md hover:bg-gray-50 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 shadow-sm">
              <img
                src="/facebookIcon.png"
                alt="Icono de Facebook"
                className="w-4 sm:w-5 h-4 sm:h-5"
              />
              <span className="text-sm sm:text-base">Facebook</span>
            </button>
          </div>
        </div>

        {/* Link de registro mejorado */}
        <p className="mt-6 mb-8 text-sm sm:text-base">
          ¿Aún no estás registrado?{" "}
          <Link
            href="/register"
            className="text-[#e53c3d] hover:text-[#c93131] transition-colors font-medium"
          >
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
