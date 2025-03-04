"use client";

import React, { useState } from "react";

function Register() {
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleClick = (role) => {
    setSelectedRole(role);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Imagen lateral */}
      <div className="w-1/2 h-full">
        <img
          src="/registerImage.jpg"
          alt="Imagen de registro"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenedor del formulario */}
      <div className="w-1/2 flex flex-col justify-center items-center h-full relative px-6">
        <h3
          className="mb-2"
          style={{
            width: "180px",
            height: "70px",
            backgroundImage: 'url("/eventflix_logo.png")',
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />

        <h1 className="text-center mb-5 font-extrabold text-2xl">Regístrate</h1>

        {/* Formulario */}
        <form className="flex flex-col items-center w-3/5 border-b border-black gap-4 pb-6">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Nombre"
            className="w-full p-2 border border-black rounded placeholder-gray-400"
          />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Correo electrónico"
            className="w-full p-2 border border-black rounded placeholder-gray-400"
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Contraseña"
            className="w-full p-2 border border-black rounded placeholder-gray-400"
          />
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirmar contraseña"
            className="w-full p-2 border border-black rounded placeholder-gray-400"
          />

          <h3 className="text-center mt-3">¿Qué eres?</h3>
          <div className="flex flex-row gap-4">
            <button
              type="button"
              onClick={() => handleRoleClick("organizador")}
              className={`px-4 py-2 border border-black rounded cursor-pointer
                ${
                  selectedRole === "organizador"
                    ? "bg-[cornflowerblue] text-white"
                    : ""
                }`}
            >
              Organizador
            </button>
            <button
              type="button"
              onClick={() => handleRoleClick("participante")}
              className={`px-4 py-2 border border-black rounded cursor-pointer
                ${
                  selectedRole === "participante"
                    ? "bg-[cornflowerblue] text-white"
                    : ""
                }`}
            >
              Participante
            </button>
          </div>

          <button
            type="submit"
            className="mt-5 mb-5 px-6 py-3 bg-black text-white rounded cursor-pointer"
          >
            Continuar
          </button>
        </form>
        <p className="mt-4">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-blue-600">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
