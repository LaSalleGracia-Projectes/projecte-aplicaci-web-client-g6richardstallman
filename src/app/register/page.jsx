"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

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
        {/* Botón de inicio */}
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
          Regístrate
        </h1>

        {/* Selector de rol */}
        <div className="w-full max-w-md md:w-4/5 lg:w-3/5 mb-6">
          <h3 className="text-center mb-3 text-sm md:text-base">¿Qué eres?</h3>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => handleRoleClick("organizador")}
              className={`px-6 py-2 border-2 border-gray-600 rounded-full cursor-pointer transition-all duration-200 hover:bg-gray-100 text-sm md:text-base
                ${
                  selectedRole === "organizador"
                    ? "bg-[#e53c3d] text-white border-[#e53c3d] hover:bg-[#d03536]"
                    : ""
                }`}
            >
              Organizador
            </button>
            <button
              type="button"
              onClick={() => handleRoleClick("participante")}
              className={`px-6 py-2 border-2 border-gray-600 rounded-full cursor-pointer transition-all duration-200 hover:bg-gray-100 text-sm md:text-base
                ${
                  selectedRole === "participante"
                    ? "bg-[#e53c3d] text-white border-[#e53c3d] hover:bg-[#d03536]"
                    : ""
                }`}
            >
              Participante
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full max-w-md md:w-4/5 lg:w-3/5 border-b border-black gap-4 pb-8"
        >
          {/* Campos comunes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              required
              className="w-full p-2 border-2 border-gray-600 rounded placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:placeholder-transparent transition-all ease-in-out duration-300"
            />
            <input
              type="text"
              name="apellido1"
              value={formData.apellido1}
              onChange={handleChange}
              placeholder="Primer apellido"
              required
              className="w-full p-2 border-2 border-gray-600 rounded placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:placeholder-transparent transition-all ease-in-out duration-300"
            />
          </div>
          <input
            type="text"
            name="apellido2"
            value={formData.apellido2}
            onChange={handleChange}
            placeholder="Segundo apellido"
            required
            className="w-full p-2 border-2 border-gray-600 rounded placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:placeholder-transparent transition-all ease-in-out duration-300"
          />

          {/* Campos específicos según rol */}
          {selectedRole === "organizador" && (
            <>
              <input
                type="text"
                name="organizacion"
                value={formData.organizacion}
                onChange={handleChange}
                placeholder="Nombre de la organización"
                required
                className="w-full p-2 border-2 border-gray-600 rounded placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:placeholder-transparent transition-all ease-in-out duration-300"
              />
              <input
                type="tel"
                name="telefonoContacto"
                value={formData.telefonoContacto}
                onChange={handleChange}
                placeholder="Teléfono de contacto"
                required
                className="w-full p-2 border-2 border-gray-600 rounded placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:placeholder-transparent transition-all ease-in-out duration-300"
              />
            </>
          )}

          {selectedRole === "participante" && (
            <>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="DNI"
                required
                className="w-full p-2 border-2 border-gray-600 rounded placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:placeholder-transparent transition-all ease-in-out duration-300"
              />
              <input
                type="tel"
                name="telefonoContacto"
                value={formData.telefonoContacto}
                onChange={handleChange}
                placeholder="Teléfono de contacto"
                required
                className="w-full p-2 border-2 border-gray-600 rounded placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:placeholder-transparent transition-all ease-in-out duration-300"
              />
            </>
          )}

          {/* Campos de email y contraseña */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            required
            className="w-full p-2 border-2 border-gray-600 rounded placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:placeholder-transparent transition-all ease-in-out duration-300"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Contraseña"
            required
            className="w-full p-2 border-2 border-gray-600 rounded placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:placeholder-transparent transition-all ease-in-out duration-300"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirmar contraseña"
            required
            className="w-full p-2 border-2 border-gray-600 rounded placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:placeholder-transparent transition-all ease-in-out duration-300"
          />

          <button
            type="submit"
            className="w-fit px-8 md:px-12 py-2.5 md:py-3 bg-black text-white rounded cursor-pointer hover:bg-gray-800 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 text-sm md:text-base mt-4"
          >
            Registrarse
          </button>
        </form>

        {/* Botones de registro social */}
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
        </div>

        {/* Link para iniciar sesión */}
        <p className="mt-6 text-sm md:text-base">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="text-red-600 hover:text-red-800 transition-colors font-medium"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
