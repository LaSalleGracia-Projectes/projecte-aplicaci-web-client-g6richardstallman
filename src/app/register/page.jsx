"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaHome, FaGoogle, FaFacebook, FaAngleRight, FaUser, FaBuilding } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { showSuccessToast, showErrorToast } from '../../utils/toastNotifications';

function Register() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizacion: "",
    telefonoContacto: "",
    dni: "",
  });

  const [formErrors, setFormErrors] = useState({});
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

  const handleRoleClick = (role) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (formErrors[e.target.name]) {
        setFormErrors(prev => {
          const newErrors = {...prev};
          delete newErrors[e.target.name];
          return newErrors;
        });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.nombre) errors.nombre = "El nombre es obligatorio";
    if (!formData.apellido1) errors.apellido1 = "El primer apellido es obligatorio";
    if (!formData.email) errors.email = "El email es obligatorio";
    if (!formData.password) errors.password = "La contraseña es obligatoria";
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Por favor, introduce un email válido";
    }
    
    if (formData.password && formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    } else if (!formData.confirmPassword) {
       errors.confirmPassword = "Confirma tu contraseña";
    }
    
    if (selectedRole === "organizador") {
      if (!formData.organizacion) errors.organizacion = "El nombre de la organización es obligatorio";
      if (!formData.telefonoContacto) errors.telefonoContacto = "El teléfono de contacto es obligatorio";
    } else if (selectedRole === "participante") {
      if (!formData.dni) errors.dni = "El DNI es obligatorio";
      if (!formData.telefonoContacto) errors.telefonoContacto = "El teléfono es obligatorio";
    }
    
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
        showErrorToast("Por favor, corrige los errores en el formulario.");
    }
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const dataToSend = {
        nombre: formData.nombre,
        apellido1: formData.apellido1,
        apellido2: formData.apellido2 || "",
        email: formData.email,
        password: formData.password,
        role: selectedRole,
        ...(selectedRole === "organizador" && {
          nombre_organizacion: formData.organizacion,
          telefono_contacto: formData.telefonoContacto
        }),
        ...(selectedRole === "participante" && {
          dni: formData.dni,
          telefono: formData.telefonoContacto
        })
      };
      
      const response = { status: "success", access_token: "dummy_token", user: { id: 1, name: formData.nombre } }; 
      await new Promise(res => setTimeout(res, 500));

      if (response && response.status === "success") {
        localStorage.setItem('user', JSON.stringify({
          isLoggedIn: true,
          token: response.access_token,
          userData: response.user
        }));
        showSuccessToast("¡Registro completado! Redirigiendo...");
        router.push('/profile');
      } else {
        showErrorToast(response?.message || "Error al registrar usuario");
      }
    } catch (error) {
      showErrorToast("No se pudo completar el registro. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setSocialLoading(provider);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      window.location.href = `${apiUrl}/auth/${provider}`;
      
    } catch (error) {
      showErrorToast(`Error al iniciar sesión con ${provider}`);
      setSocialLoading("");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      <div className="hidden md:block md:w-1/2 lg:w-2/5 relative h-screen">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
        <img
          src="/registerImage.jpg"
          alt="Imagen de registro"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 lg:w-3/5 flex flex-col h-screen overflow-hidden">
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

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8">
          <div className="flex justify-center mb-6 sm:mb-8">
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
            {step === 1 ? "Crear cuenta" : "Completa tu perfil"}
          </h1>

          {step === 1 && (
            <div className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto">
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

          {step === 2 && (
            <form onSubmit={handleSubmit} className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto space-y-5">
              <div className="w-full bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 flex items-center justify-center bg-red-100 text-[#e53c3d] rounded-full">
                    {selectedRole === "participante" ? (
                      <FaUser className="text-lg" />
                    ) : (
                      <FaBuilding className="text-lg" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tipo de cuenta:</p>
                    <p className="font-medium text-gray-800 capitalize">
                      {selectedRole === "participante" ? "Participante" : "Organizador"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-[#e53c3d] hover:text-[#c93131] font-medium hover:underline"
                >
                  Cambiar
                </button>
              </div>
              
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
                    className={`w-full p-3 border-2 ${
                      formErrors.nombre ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 hover:border-gray-400 active:border-gray-500 transition-all duration-200`}
                    required
                  />
                  {formErrors.nombre && (
                    <p className="text-red-500 text-xs italic">{formErrors.nombre}</p>
                  )}
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
                    className={`w-full p-3 border-2 ${
                      formErrors.apellido1 ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 hover:border-gray-400 active:border-gray-500 transition-all duration-200`}
                    required
                  />
                  {formErrors.apellido1 && (
                    <p className="text-red-500 text-xs italic">{formErrors.apellido1}</p>
                  )}
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
                  className={`w-full p-3 border-2 ${
                    formErrors.apellido2 ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 hover:border-gray-400 active:border-gray-500 transition-all duration-200`}
                />
                {formErrors.apellido2 && (
                  <p className="text-red-500 text-xs italic">{formErrors.apellido2}</p>
                )}
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
                  className={`w-full p-3 border-2 ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 hover:border-gray-400 active:border-gray-500 transition-all duration-200`}
                  required
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs italic">{formErrors.email}</p>
                )}
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
                    className={`w-full p-3 border-2 ${
                      formErrors.password ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 hover:border-gray-400 active:border-gray-500 transition-all duration-200`}
                    required
                    minLength={6}
                  />
                  {formErrors.password && (
                    <p className="text-red-500 text-xs italic">{formErrors.password}</p>
                  )}
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
                    className={`w-full p-3 border-2 ${
                      formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 hover:border-gray-400 active:border-gray-500 transition-all duration-200`}
                    required
                  />
                  {formErrors.confirmPassword && (
                    <p className="text-red-500 text-xs italic">{formErrors.confirmPassword}</p>
                  )}
                </div>
              </div>
              
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
                      className={`w-full p-3 border-2 ${
                        formErrors.organizacion ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 hover:border-gray-400 active:border-gray-500 transition-all duration-200`}
                      required
                    />
                    {formErrors.organizacion && (
                      <p className="text-red-500 text-xs italic">{formErrors.organizacion}</p>
                    )}
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
                      className={`w-full p-3 border-2 ${
                        formErrors.telefonoContacto ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 hover:border-gray-400 active:border-gray-500 transition-all duration-200`}
                      required
                    />
                    {formErrors.telefonoContacto && (
                      <p className="text-red-500 text-xs italic">{formErrors.telefonoContacto}</p>
                    )}
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
                      className={`w-full p-3 border-2 ${
                        formErrors.dni ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 hover:border-gray-400 active:border-gray-500 transition-all duration-200`}
                      required
                    />
                    {formErrors.dni && (
                      <p className="text-red-500 text-xs italic">{formErrors.dni}</p>
                    )}
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
                      className={`w-full p-3 border-2 ${
                        formErrors.telefonoContacto ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 hover:border-gray-400 active:border-gray-500 transition-all duration-200`}
                      required
                    />
                    {formErrors.telefonoContacto && (
                      <p className="text-red-500 text-xs italic">{formErrors.telefonoContacto}</p>
                    )}
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
                      Cargando...
                    </span>
                  ) : (
                    "Crear cuenta"
                  )}
                </button>
              </div>
              
              <div className="w-full border-b border-gray-300 mt-4" />
              
              <div className="flex flex-col items-center w-full mt-6">
                <p className="text-sm text-gray-500 mb-4">O regístrate con</p>
                
                <div className="flex justify-center w-full max-w-sm">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    disabled={socialLoading === 'google'}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 hover:border-gray-400 hover:shadow-sm hover:scale-[1.01] active:scale-[0.98] max-w-xs"
                  >
                    {socialLoading === 'google' ? (
                      "Cargando..."
                    ) : (
                      <FaGoogle className="text-red-500" />
                    )}
                    <span>Google</span>
                  </button>
                </div>
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
    </div>
  );
}

export default Register;
