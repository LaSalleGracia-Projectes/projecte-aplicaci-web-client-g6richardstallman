"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaIdCard, 
  FaBuilding, 
  FaSave,
  FaTimes,
  FaHome,
  FaCamera,
  FaPen
} from "react-icons/fa";
import ProfileNavBar from "@/components/userProfile/profileNavBar";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function EditInformationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState("/img1.webp");
  const [showImageModal, setShowImageModal] = useState(false);

  const [userData, setUserData] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    email: "",
    telefono: "",
    dni: "",
    organizacion: ""
  });

  const [editableFields, setEditableFields] = useState({
    nombre: false,
    apellido1: false,
    apellido2: false,
    telefono: false
  });

  // Simular carga de datos
  useEffect(() => {
    setTimeout(() => {
      setUserData({
        nombre: "Juan",
        apellido1: "García",
        apellido2: "López",
        email: "juan@ejemplo.com",
        telefono: "+34 666 666 666",
        dni: "12345678A",
        organizacion: "Eventos García S.L."
      });
      setIsLoading(false);
    }, 600);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleFieldEdit = (fieldName) => {
    setEditableFields(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!userData.nombre) {
      errors.nombre = "El nombre es obligatorio";
      isValid = false;
    }

    if (!userData.apellido1) {
      errors.apellido1 = "El primer apellido es obligatorio";
      isValid = false;
    }

    if (!userData.email) {
      errors.email = "El email es obligatorio";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = "El email no es válido";
      isValid = false;
    }

    if (!userData.telefono) {
      errors.telefono = "El teléfono es obligatorio";
      isValid = false;
    }

    if (!userData.dni) {
      errors.dni = "El DNI/NIF es obligatorio";
      isValid = false;
    }

    setError(isValid ? "" : errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      setError("");

      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push("/profile");
    } catch (error) {
      setError({ general: "Error al actualizar los datos" });
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen size="lg" />;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <ProfileNavBar />

      <div className="flex-1 p-4 md:p-8 overflow-y-auto relative">
        {/* Botón para volver al inicio (ahora sticky) */}
        <Link
          href="/"
          className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-md"
          aria-label="Volver al inicio"
        >
          <FaHome className="text-lg" />
          <span className="font-medium">Inicio</span>
        </Link>

        <div className="max-w-4xl mx-auto pt-16">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Banner y foto de perfil */}
            <div className="relative h-40 bg-gradient-to-r from-[#2d3748] to-[#1a202c]">
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                    <img 
                      src={profileImage} 
                      alt="Foto de perfil" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowImageModal(true)}
                    className="absolute bottom-0 right-0 bg-[#e53c3d] text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors"
                  >
                    <FaCamera size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Contenido del formulario */}
            <div className="p-6 pt-16 md:p-8 md:pt-16">
              <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Editar Información Personal</h1>
              
              {error.general && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
                  {error.general}
                </div>
              )}

              {/* Campos de información personal */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaUser />
                    </div>
                    <input
                      type="text"
                      name="nombre"
                      value={userData.nombre}
                      onChange={handleChange}
                      disabled={!editableFields.nombre}
                      className={`w-full pl-10 pr-12 p-3 border rounded-xl focus:outline-none ${
                        editableFields.nombre 
                          ? "border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20" 
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    />
                    <button 
                      type="button"
                      onClick={() => toggleFieldEdit('nombre')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#e53c3d] transition-colors"
                    >
                      <FaPen size={14} />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primer apellido
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaUser />
                    </div>
                    <input
                      type="text"
                      name="apellido1"
                      value={userData.apellido1}
                      onChange={handleChange}
                      disabled={!editableFields.apellido1}
                      className={`w-full pl-10 pr-12 p-3 border rounded-xl focus:outline-none ${
                        editableFields.apellido1 
                          ? "border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20" 
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    />
                    <button 
                      type="button"
                      onClick={() => toggleFieldEdit('apellido1')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#e53c3d] transition-colors"
                    >
                      <FaPen size={14} />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Segundo apellido
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaUser />
                    </div>
                    <input
                      type="text"
                      name="apellido2"
                      value={userData.apellido2}
                      onChange={handleChange}
                      disabled={!editableFields.apellido2}
                      className={`w-full pl-10 pr-12 p-3 border rounded-xl focus:outline-none ${
                        editableFields.apellido2 
                          ? "border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20" 
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    />
                    <button 
                      type="button"
                      onClick={() => toggleFieldEdit('apellido2')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#e53c3d] transition-colors"
                    >
                      <FaPen size={14} />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaPhone />
                    </div>
                    <input
                      type="tel"
                      name="telefono"
                      value={userData.telefono}
                      onChange={handleChange}
                      disabled={!editableFields.telefono}
                      className={`w-full pl-10 pr-12 p-3 border rounded-xl focus:outline-none ${
                        editableFields.telefono 
                          ? "border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20" 
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    />
                    <button 
                      type="button"
                      onClick={() => toggleFieldEdit('telefono')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#e53c3d] transition-colors"
                    >
                      <FaPen size={14} />
                    </button>
                  </div>
                </div>
                
                {/* Campo de email no editable */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaEnvelope />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      disabled
                      className="w-full pl-10 p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                      <FaTimes />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">No es posible cambiar el email de la cuenta</p>
                </div>
                
                {/* Campo de DNI no editable */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DNI/NIF
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaIdCard />
                    </div>
                    <input
                      type="text"
                      name="dni"
                      value={userData.dni}
                      disabled
                      className="w-full pl-10 p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                      <FaTimes />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">El DNI/NIF no se puede modificar</p>
                </div>
              </div>

              {/* Campo de organización (solo para organizadores) y no editable */}
              {userData.role === "organizador" && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la organización
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaBuilding />
                    </div>
                    <input
                      type="text"
                      name="organizacion"
                      value={userData.organizacion}
                      disabled
                      className="w-full pl-10 p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                      <FaTimes />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">No es posible cambiar el nombre de la organización</p>
                </div>
              )}

              {/* Sección para cambiar la contraseña */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h2 className="text-xl font-semibold mb-5 text-gray-900 flex items-center gap-2">
                  <FaIdCard className="text-[#e53c3d]" />
                  <span>Cambiar contraseña</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña actual
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FaIdCard />
                      </div>
                      <input
                        type="password"
                        name="currentPassword"
                        placeholder="Introduce tu contraseña actual"
                        className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FaIdCard />
                      </div>
                      <input
                        type="password"
                        name="newPassword"
                        placeholder="Introduce tu nueva contraseña"
                        className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar nueva contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FaIdCard />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirma tu nueva contraseña"
                        className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="text-sm font-semibold text-blue-800 mb-2">Requisitos de la contraseña:</h3>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-500 text-xs">✓</span>
                      </div>
                      Al menos 8 caracteres
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-500 text-xs">✓</span>
                      </div>
                      Al menos una letra mayúscula
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-500 text-xs">✓</span>
                      </div>
                      Al menos una letra minúscula
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-500 text-xs">✓</span>
                      </div>
                      Al menos un número
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-500 text-xs">✓</span>
                      </div>
                      Al menos un carácter especial (@, $, !, %, *, ?, &)
                    </li>
                  </ul>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="px-6 py-2.5 bg-[#e53c3d] text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Cambiar contraseña
                  </button>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => router.push("/profile")}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#e53c3d] text-white rounded-xl hover:bg-red-600 transition-colors disabled:bg-red-400"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <FaSave />
                      <span>Guardar cambios</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Modal para cambiar imagen */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Cambiar foto de perfil</h3>
              <button 
                onClick={() => setShowImageModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">Selecciona una nueva imagen de perfil:</p>
              <div className="grid grid-cols-3 gap-3">
                {["/img1.webp", "/img2.webp", "/img3.webp", "/img4.webp"].map(img => (
                  <div 
                    key={img}
                    className={`w-full pt-[100%] relative rounded-lg overflow-hidden cursor-pointer border-2 hover:opacity-90 transition-all ${
                      profileImage === img ? "border-[#e53c3d]" : "border-transparent"
                    }`}
                    onClick={() => setProfileImage(img)}
                  >
                    <img 
                      src={img} 
                      alt="Opción de avatar" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div
                  className="w-full pt-[100%] relative rounded-lg overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all bg-gray-50 flex items-center justify-center"
                >
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <FaCamera size={24} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Aquí iría la lógica para guardar la imagen seleccionada
                  setShowImageModal(false);
                }}
                className="px-4 py-2 bg-[#e53c3d] text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
