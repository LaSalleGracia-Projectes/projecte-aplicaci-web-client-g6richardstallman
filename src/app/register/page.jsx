"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaHome, FaGoogle, FaFacebook, FaAngleRight, FaUser, FaBuilding, FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { register } from "../../api/auth";

function Register() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: selección de rol, 2: formulario
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
    setStep(2); // Avanzar al formulario
    setError(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    
    try {
      setLoading(true);
      
      // Preparar datos para enviar al backend
      const registerData = {
        nombre: formData.nombre,
        apellido1: formData.apellido1,
        apellido2: formData.apellido2 || null,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
      };
      
      // Agregar campos específicos según el rol
      if (selectedRole === "organizador") {
        registerData.nombre_organizacion = formData.organizacion;
        registerData.telefono_contacto = formData.telefonoContacto;
      } else if (selectedRole === "participante") {
        registerData.dni = formData.dni;
        registerData.telefono = formData.telefonoContacto;
      }
      
      const response = await register(registerData);
      
      if (response.status === "success") {
        router.push("/");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.messages) {
          const errorMessages = Object.values(error.response.data.messages).flat();
          setError(errorMessages.join(', '));
        } else {
          setError(error.response.data.message || "Error en el registro");
        }
      } else {
        setError("Error al conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = async (provider) => {
    try {
      setSocialLoading(provider);
      
      // En una implementación real, redirigiría al endpoint de OAuth
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/${provider}/register`;
      
    } catch (error) {
      setError(`Error al registrarse con ${provider}`);
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
          alt="Imagen de registro"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-8 left-8 right-8 text-white z-20">
          <h2 className="text-2xl lg:text-3xl font-bold mb-2">¡Únete a nuestra comunidad!</h2>
          <p className="text-sm lg:text-base opacity-90">Crea una cuenta para descubrir y participar en eventos increíbles</p>
        </div>
      </div>

      {/* Contenedor del formulario */}
      <div className="w-full md:w-1/2 lg:w-3/5 flex flex-col justify-center items-center min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-10 relative overflow-y-auto">
        {/* Botón de inicio */}
        <Link
          href="/"
          className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-2 bg-black text-white rounded-full hover:bg-gray-800 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-md"
        >
          <FaHome className="text-lg" />
          <span className="text-sm font-medium md:inline hidden">Inicio</span>
        </Link>

        {/* Botón para volver a selección de rol si estamos en paso 2 */}
        {step === 2 && (
          <button
            onClick={() => setStep(1)}
            className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
          >
            <span className="text-sm font-medium">Cambiar rol</span>
          </button>
        )}

        {/* Logo */}
        <div className="mb-6 sm:mb-8 mt-12 md:mt-0 transform hover:scale-105 transition-transform duration-300">
          <div
            className="w-[130px] h-[52px] sm:w-[150px] sm:h-[60px]"
            style={{
              backgroundImage: 'url("/logo.webp")',
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
        </div>

        <h1 className="text-center mb-6 font-extrabold text-2xl sm:text-3xl md:text-4xl text-black">
          {step === 1 ? "Crear cuenta" : "Completa tu perfil"}
        </h1>

        {/* Mensaje de error */}
        {error && (
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg shadow-sm animate-fadeIn">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Paso 1: Selección de rol */}
        {step === 1 && (
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl">
            <div className="text-center mb-6">
              <p className="text-gray-600">Selecciona el tipo de cuenta que deseas crear:</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <button 
                onClick={() => handleRoleClick("participante")}
                className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl hover:border-[#e53c3d] hover:bg-red-50 transition-all duration-200 group"
              >
                <div className="w-16 h-16 flex items-center justify-center bg-red-100 text-[#e53c3d] rounded-full mb-4 group-hover:bg-[#e53c3d] group-hover:text-white transition-all duration-200">
                  <FaUser className="text-2xl" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Participante</h3>
                <p className="text-sm text-gray-500 text-center">Para asistir a eventos y gestionar tus inscripciones</p>
                <FaAngleRight className="mt-4 text-gray-400 group-hover:text-[#e53c3d] transition-all duration-200" />
              </button>
              
              <button 
                onClick={() => handleRoleClick("organizador")}
                className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl hover:border-[#e53c3d] hover:bg-red-50 transition-all duration-200 group"
              >
                <div className="w-16 h-16 flex items-center justify-center bg-red-100 text-[#e53c3d] rounded-full mb-4 group-hover:bg-[#e53c3d] group-hover:text-white transition-all duration-200">
                  <FaBuilding className="text-2xl" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Organizador</h3>
                <p className="text-sm text-gray-500 text-center">Para crear y gestionar tus propios eventos</p>
                <FaAngleRight className="mt-4 text-gray-400 group-hover:text-[#e53c3d] transition-all duration-200" />
              </button>
            </div>
            
            {/* Opciones de registro social */}
            <div className="flex flex-col items-center w-full mt-6">
              <p className="text-sm text-gray-500 mb-4">O regístrate con</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                <button 
                  onClick={() => handleSocialRegister('google')}
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
                  onClick={() => handleSocialRegister('facebook')}
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
            
            {/* Enlace a login - añadir esto */}
            <div className="w-full mt-6 p-4 text-center bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="text-[#e53c3d] hover:text-[#c93131] transition-colors font-medium hover:underline">
                  Inicia sesión ahora
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Paso 2: Formulario según rol seleccionado */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="w-full max-w-md sm:max-w-lg md:max-w-xl space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full">
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 transition-all duration-200"
                  required
                />
              </div>
              
              <div className="w-full">
                <label htmlFor="apellido1" className="block text-sm font-medium text-gray-700 mb-1">Primer apellido</label>
                <input
                  type="text"
                  name="apellido1"
                  id="apellido1"
                  value={formData.apellido1}
                  onChange={handleChange}
                  placeholder="Tu primer apellido"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 transition-all duration-200"
                  required
                />
              </div>
            </div>
            
            <div className="w-full">
              <label htmlFor="apellido2" className="block text-sm font-medium text-gray-700 mb-1">Segundo apellido (opcional)</label>
              <input
                type="text"
                name="apellido2"
                id="apellido2"
                value={formData.apellido2}
                onChange={handleChange}
                placeholder="Tu segundo apellido"
                className="w-full p-3 border-2 border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 transition-all duration-200"
              />
            </div>
            
            <div className="w-full">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="w-full p-3 border-2 border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 transition-all duration-200"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="6+ caracteres"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 transition-all duration-200"
                  required
                  minLength={6}
                />
              </div>
              
              <div className="w-full">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirma tu contraseña"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 transition-all duration-200"
                  required
                />
              </div>
            </div>
            
            {/* Campos específicos según rol */}
            {selectedRole === "organizador" && (
              <>
                <div className="w-full">
                  <label htmlFor="organizacion" className="block text-sm font-medium text-gray-700 mb-1">Nombre de la organización</label>
                  <input
                    type="text"
                    name="organizacion"
                    id="organizacion"
                    value={formData.organizacion}
                    onChange={handleChange}
                    placeholder="Nombre de tu organización"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 transition-all duration-200"
                    required
                  />
                </div>
                
                <div className="w-full">
                  <label htmlFor="telefonoContacto" className="block text-sm font-medium text-gray-700 mb-1">Teléfono de contacto</label>
                  <input
                    type="tel"
                    name="telefonoContacto"
                    id="telefonoContacto"
                    value={formData.telefonoContacto}
                    onChange={handleChange}
                    placeholder="Teléfono de contacto"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 transition-all duration-200"
                    required
                  />
                </div>
              </>
            )}
            
            {selectedRole === "participante" && (
              <>
                <div className="w-full">
                  <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                  <input
                    type="text"
                    name="dni"
                    id="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    placeholder="Tu DNI"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 transition-all duration-200"
                    required
                  />
                </div>
                
                <div className="w-full">
                  <label htmlFor="telefonoContacto" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    name="telefonoContacto"
                    id="telefonoContacto"
                    value={formData.telefonoContacto}
                    onChange={handleChange}
                    placeholder="Tu teléfono"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 transition-all duration-200"
                    required
                  />
                </div>
              </>
            )}
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 bg-[#e53c3d] text-white rounded-lg font-medium cursor-pointer hover:bg-[#d02e2f] transform hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Creando cuenta...
                  </span>
                ) : (
                  "Crear cuenta"
                )}
              </button>
            </div>
            
            <div className="w-full mt-6 p-4 text-center bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="text-[#e53c3d] hover:text-[#c93131] transition-colors font-medium hover:underline">
                  Inicia sesión ahora
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Register;
