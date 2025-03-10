"use client";

import { useState } from "react";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

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
          Establece tu nueva contraseña
        </h1>

        <p className="text-center text-sm md:text-base mb-6 px-4 md:px-0">
          Por favor, introduce tu nueva contraseña:
        </p>

        {/* Formulario de reset */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full max-w-md md:w-4/5 lg:w-3/5 border-b border-black gap-4 pb-8"
        >
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nueva contraseña"
            required
            className="w-full p-2 border-2 border-gray-600 rounded placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:placeholder-transparent transition-all ease-in-out duration-300"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirmar nueva contraseña"
            required
            className="w-full p-2 border-2 border-gray-600 rounded placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:placeholder-transparent transition-all ease-in-out duration-300"
          />
          <button
            type="submit"
            className="w-fit px-8 md:px-12 py-2.5 md:py-3 bg-black text-white rounded cursor-pointer hover:bg-gray-800 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 text-sm md:text-base"
          >
            Actualizar contraseña
          </button>
        </form>

        {/* Link para volver al login */}
        <p className="mt-6 text-sm md:text-base">
          <Link
            href="/login"
            className="text-red-600 hover:text-red-800 transition-colors font-medium"
          >
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
