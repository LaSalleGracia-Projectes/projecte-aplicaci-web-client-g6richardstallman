"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import Image from "next/image";

function Register() {
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Campos adicionales según rol
    organizacion: "",
    telefonoContacto: "",
    dni: "",
  });

  const handleRoleClick = (role) => {
    setSelectedRole(role);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password === formData.confirmPassword) {
      console.log("Registro exitoso", { ...formData, role: selectedRole });
    } else {
      console.log("Las contraseñas no coinciden");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Imagen lateral - adaptable según tamaño de pantalla */}
      <div className="hidden md:block md:w-1/2 lg:w-2/5 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
        <img
          src="/registerImage.jpg"
          alt="Imagen de registro"
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
          Regístrate
        </h1>

        {/* Selector de rol mejorado */}
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl mb-6">
          <h3 className="text-center mb-4 text-sm md:text-base font-medium">
            ¿Qué eres?
          </h3>
          <div className="flex justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => handleRoleClick("organizador")}
              className={`px-4 sm:px-6 py-2 border-2 rounded-full cursor-pointer transition-all duration-200 text-sm sm:text-base font-medium
                ${
                  selectedRole === "organizador"
                    ? "bg-[#e53c3d] text-white border-[#e53c3d] hover:bg-[#d03536] shadow-md"
                    : "border-gray-600 hover:bg-gray-50"
                }`}
            >
              Organizador
            </button>
            <button
              type="button"
              onClick={() => handleRoleClick("participante")}
              className={`px-4 sm:px-6 py-2 border-2 rounded-full cursor-pointer transition-all duration-200 text-sm sm:text-base font-medium
                ${
                  selectedRole === "participante"
                    ? "bg-[#e53c3d] text-white border-[#e53c3d] hover:bg-[#d03536] shadow-md"
                    : "border-gray-600 hover:bg-gray-50"
                }`}
            >
              Participante
            </button>
          </div>
        </div>

        {/* Formulario mejorado con animaciones y mejor espaciado */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full max-w-md sm:max-w-lg md:max-w-xl border-b border-gray-300 gap-3 sm:gap-4 pb-8"
        >
          {/* Campos nombre y apellido juntos para ahorro de espacio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              required
              className="w-full p-2.5 border-2 border-gray-400 rounded-md placeholder-gray-500 focus:outline-none focus:border-[#e53c3d] focus:ring-1 focus:ring-[#e53c3d] transition-all duration-200"
            />
            <input
              type="text"
              name="apellido1"
              value={formData.apellido1}
              onChange={handleChange}
              placeholder="Primer apellido"
              required
              className="w-full p-2.5 border-2 border-gray-400 rounded-md placeholder-gray-500 focus:outline-none focus:border-[#e53c3d] focus:ring-1 focus:ring-[#e53c3d] transition-all duration-200"
            />
          </div>
          <input
            type="text"
            name="apellido2"
            value={formData.apellido2}
            onChange={handleChange}
            placeholder="Segundo apellido"
            className="w-full p-2.5 border-2 border-gray-400 rounded-md placeholder-gray-500 focus:outline-none focus:border-[#e53c3d] focus:ring-1 focus:ring-[#e53c3d] transition-all duration-200"
          />

          {/* Campos específicos según rol con transiciones suaves */}
          {selectedRole === "organizador" && (
            <div className="w-full space-y-3 sm:space-y-4 animate-fadeIn">
              <input
                type="text"
                name="organizacion"
                value={formData.organizacion}
                onChange={handleChange}
                placeholder="Nombre de la organización"
                required
                className="w-full p-2.5 border-2 border-gray-400 rounded-md placeholder-gray-500 focus:outline-none focus:border-[#e53c3d] focus:ring-1 focus:ring-[#e53c3d] transition-all duration-200"
              />
              <input
                type="tel"
                name="telefonoContacto"
                value={formData.telefonoContacto}
                onChange={handleChange}
                placeholder="Teléfono de contacto"
                required
                className="w-full p-2.5 border-2 border-gray-400 rounded-md placeholder-gray-500 focus:outline-none focus:border-[#e53c3d] focus:ring-1 focus:ring-[#e53c3d] transition-all duration-200"
              />
            </div>
          )}

          {selectedRole === "participante" && (
            <div className="w-full space-y-3 sm:space-y-4 animate-fadeIn">
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="DNI"
                required
                className="w-full p-2.5 border-2 border-gray-400 rounded-md placeholder-gray-500 focus:outline-none focus:border-[#e53c3d] focus:ring-1 focus:ring-[#e53c3d] transition-all duration-200"
              />
              <input
                type="tel"
                name="telefonoContacto"
                value={formData.telefonoContacto}
                onChange={handleChange}
                placeholder="Teléfono de contacto"
                required
                className="w-full p-2.5 border-2 border-gray-400 rounded-md placeholder-gray-500 focus:outline-none focus:border-[#e53c3d] focus:ring-1 focus:ring-[#e53c3d] transition-all duration-200"
              />
            </div>
          )}

          {/* Campos de email y contraseña con mejor diseño */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            required
            className="w-full p-2.5 border-2 border-gray-400 rounded-md placeholder-gray-500 focus:outline-none focus:border-[#e53c3d] focus:ring-1 focus:ring-[#e53c3d] transition-all duration-200"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Contraseña"
            required
            className="w-full p-2.5 border-2 border-gray-400 rounded-md placeholder-gray-500 focus:outline-none focus:border-[#e53c3d] focus:ring-1 focus:ring-[#e53c3d] transition-all duration-200"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirmar contraseña"
            required
            className="w-full p-2.5 border-2 border-gray-400 rounded-md placeholder-gray-500 focus:outline-none focus:border-[#e53c3d] focus:ring-1 focus:ring-[#e53c3d] transition-all duration-200"
          />

          <button
            type="submit"
            className="w-fit mt-4 px-8 sm:px-12 py-2.5 sm:py-3 bg-black text-white rounded-md font-medium cursor-pointer hover:bg-gray-800 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 shadow-md text-sm sm:text-base"
          >
            Registrarse
          </button>
        </form>

        {/* Botones de registro social mejorados */}
        <div className="flex flex-col items-center w-full max-w-md sm:max-w-lg md:max-w-xl mt-6 sm:mt-8">
          <p className="text-sm text-gray-500 mb-3">O regístrate con</p>

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

        {/* Link para iniciar sesión mejorado */}
        <p className="mt-6 mb-8 text-sm sm:text-base">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="text-[#e53c3d] hover:text-[#c93131] transition-colors font-medium"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
