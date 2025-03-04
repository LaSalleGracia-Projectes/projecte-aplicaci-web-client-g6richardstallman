"use client";

import React from "react";
import Link from "next/link";

function Login() {
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
            backgroundImage: 'url("/logo.webp")',
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />

        <h1 className="text-center mb-5 font-extrabold text-2xl">
          Inicia Sesión
        </h1>

        {/* Formulario de login */}
        <form className="flex flex-col items-center w-3/5 border-b border-black gap-4 pb-6">
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
          <button
            type="submit"
            className="mt-3 px-6 py-3 bg-black text-white rounded cursor-pointer"
          >
            Continuar
          </button>
        </form>

        <h1>¿Has olvidado tu contraseña?</h1>
        <Link
          href="/login/forgot-password"
          className="flex flex-col items-center gap-1 text-[18px] text-black no-underline"
        >
          <p className="mt-4">
            Recuperar contraseña
          </p>
        </Link>

        <p className="mt-2">
          ¿Aún no estás registrado?{" "}
          <a href="/" className="text-blue-600">
            Registrarse
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
