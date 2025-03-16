"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaIdCard, 
  FaSave,
  FaTimes,
  FaHome,
  FaCamera,
  FaPen,
  FaLock
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

  // Modificación para los campos editables con los lápices mejorados
  const renderField = (label, name, icon) => {
    const isEditable = name !== 'email' && name !== 'dni';
    
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-gray-700 font-medium flex items-center gap-2">
            {icon}
            {label}
          </label>
          
          {isEditable ? (
            <button
              type="button"
              onClick={() => toggleFieldEdit(name)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                editableFields[name] 
                  ? "bg-red-100 text-[#e53c3d] hover:bg-red-200" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              aria-label={`${editableFields[name] ? "Cancelar edición" : "Editar"} ${label}`}
            >
              {editableFields[name] ? (
                <>
                  <FaTimes size={12} />
                  <span className="text-xs font-medium">Cancelar</span>
                </>
              ) : (
                <>
                  <FaPen size={12} />
                  <span className="text-xs font-medium">Editar</span>
                </>
              )}
            </button>
          ) : (
            <div className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-md flex items-center gap-1.5 text-xs">
              <FaIdCard size={12} />
              <span>No editable</span>
            </div>
          )}
        </div>
        
        <div className="relative">
          <input
            type={name === "email" ? "email" : "text"}
            id={name}
            name={name}
            value={userData[name]}
            onChange={handleChange}
            disabled={!isEditable || !editableFields[name]}
            className={`w-full px-4 py-3 rounded-lg border ${
              error[name] ? "border-red-300 bg-red-50" : "border-gray-300"
            } ${
              !isEditable || !editableFields[name]
                ? "bg-gray-50 cursor-not-allowed text-gray-500"
                : "bg-white"
            } focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#e53c3d] transition-all`}
          />
          
          {error[name] && (
            <p className="text-red-500 text-sm mt-1">{error[name]}</p>
          )}
          
          {!isEditable && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FaLock size={14} />
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen size="lg" />;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <ProfileNavBar />

      <div className="flex-1 p-4 md:p-8 overflow-y-auto relative">
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
            <div className="p-8">
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-md">
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
              
              <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Editar Información Personal</h1>
              
              {error.general && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
                  {error.general}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                {renderField("Nombre", "nombre", <FaUser className="text-[#e53c3d]" />)}
                {renderField("Primer apellido", "apellido1", <FaUser className="text-[#e53c3d]" />)}
                {renderField("Segundo apellido", "apellido2", <FaUser className="text-[#e53c3d]" />)}
                {renderField("Email", "email", <FaEnvelope className="text-[#e53c3d]" />)}
                {renderField("Teléfono", "telefono", <FaPhone className="text-[#e53c3d]" />)}
                {renderField("DNI/NIE", "dni", <FaIdCard className="text-[#e53c3d]" />)}
                {renderField("Organización (opcional)", "organizacion", <FaIdCard className="text-[#e53c3d]" />)}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h2 className="text-xl font-semibold mb-5 text-gray-900 flex items-center gap-2">
                  <FaIdCard className="text-[#e53c3d]" />
                  <span>Cambiar contraseña</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña actual</label>
                    <input
                      type="password"
                      name="currentPassword"
                      placeholder="Introduce tu contraseña actual"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nueva contraseña</label>
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="Introduce tu nueva contraseña"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar nueva contraseña</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirma tu nueva contraseña"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 focus:outline-none"
                    />
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
