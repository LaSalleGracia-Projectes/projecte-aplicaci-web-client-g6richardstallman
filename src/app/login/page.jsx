"use client";

import React from "react";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

function Login() {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Imagen lateral - oculta en móvil */}
      <div className="hidden md:block md:w-1/2 lg:w-1/2 h-full">
        <img
          src="/registerImage.jpg"
          alt="Imagen de registro"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenedor del formulario */}
      <div className="w-full md:w-1/2 lg:w-1/2 flex flex-col justify-center items-center h-full relative px-4 md:px-6 lg:px-8 py-8 md:py-0">
        {/* Botón de inicio mejorado */}
        <Link
          href="/"
          className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <FaHome className="text-xl" />
          <span className="text-sm font-medium">Inicio</span>
        </Link>

        {/* Logo */}
        <h3
          className="mb-2"
          style={{
            width: "140px",
            height: "55px",
            backgroundImage: 'url("/logo.webp")',
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />

        <h1 className="text-center mb-5 font-extrabold text-xl md:text-2xl">
          Inicia Sesión
        </h1>

        {/* Formulario de login */}
        <form className="flex flex-col items-center w-full max-w-md md:w-4/5 lg:w-3/5 border-b border-black gap-4 pb-8">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Correo electrónico"
            className="w-full p-2 border-2 border-gray-600 rounded placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:placeholder-transparent transition-all ease-in-out duration-300"
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Contraseña"
            className="w-full p-2 border-2 border-gray-600 rounded placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:placeholder-transparent transition-all ease-in-out duration-300"
          />
          <button
            type="submit"
            className="w-fit px-8 md:px-12 py-2.5 md:py-3 bg-black text-white rounded cursor-pointer hover:bg-gray-800 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 text-sm md:text-base"
          >
            Continuar
          </button>
        </form>

        {/* Botones de inicio de sesión social */}
        <div className="flex flex-col items-center w-full max-w-md md:w-4/5 lg:w-3/5">
          <button className="w-full md:w-full lg:w-4/5 flex items-center justify-center gap-2 mt-6 px-4 md:px-6 py-2.5 md:py-3 border border-black rounded hover:bg-gray-100 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200">
            <img
              src="/googleIcon.png"
              alt="Icono de Google"
              className="w-4 md:w-5 h-4 md:h-5"
            />
            <span className="text-sm md:text-base">Continuar con Google</span>
          </button>

          <button className="w-full md:w-full lg:w-4/5 flex items-center justify-center gap-2 mt-4 px-4 md:px-6 py-2.5 md:py-3 border border-black rounded hover:bg-gray-100 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200">
            <img
              src="/facebookIcon.png"
              alt="Icono de Facebook"
              className="w-4 md:w-5 h-4 md:h-5"
            />
            <span className="text-sm md:text-base">Continuar con Facebook</span>
          </button>

          {/* Sección de recuperación de contraseña */}
          <div className="w-full text-center mt-8 mb-2">
            <h2 className="text-base md:text-lg font-medium">
              ¿Has olvidado tu contraseña?
            </h2>
            <Link
              href="/login/forgot-password"
              className="inline-block mt-2 text-sm md:text-base text-red-600 hover:text-red-800 transition-colors"
            >
              Recuperar contraseña
            </Link>
          </div>

          {/* Link de registro */}
          <p className="mt-6 text-sm md:text-base">
            ¿Aún no estás registrado?{" "}
            <Link
              href="/register"
              className="text-red-600 hover:text-red-800 transition-colors font-medium"
            >
              Registrarse
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
