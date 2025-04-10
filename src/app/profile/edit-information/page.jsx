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
import ProfileNavBar from "../../../components/userProfile/profileNavBar";
import { showSuccessToast, showErrorToast } from '../../../utils/toastNotifications';

export default function EditInformationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errors, setErrors] = useState({}); 
  const [profileImage, setProfileImage] = useState("/img1.webp");
  const [newProfileImageFile, setNewProfileImageFile] = useState(null);
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
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [editableFields, setEditableFields] = useState({
    nombre: false,
    apellido1: false,
    apellido2: false,
    telefono: false
  });

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
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors.password) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.password;
        return newErrors;
      });
    }
  };

  const toggleFieldEdit = (fieldName) => {
    setEditableFields(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const validateForm = () => {
    const fieldErrors = {};
    let isValid = true;

    if (!userData.nombre) {
      fieldErrors.nombre = "El nombre es obligatorio";
      isValid = false;
    }
    if (!userData.apellido1) {
      fieldErrors.apellido1 = "El primer apellido es obligatorio";
      isValid = false;
    }
    if (!userData.email) {
      fieldErrors.email = "El email es obligatorio";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      fieldErrors.email = "El email no es válido";
      isValid = false;
    }
    if (!userData.telefono) {
      fieldErrors.telefono = "El teléfono es obligatorio";
      isValid = false;
    }
    if (!userData.dni) {
      fieldErrors.dni = "El DNI/NIF es obligatorio";
      isValid = false;
    }

    setErrors(isValid ? {} : fieldErrors);
    if (!isValid) {
      showErrorToast("Revisa los campos marcados en rojo.");
    }
    return isValid;
  };

  const validatePasswordForm = () => {
    const pwErrors = {};
    if (!passwordData.currentPassword) pwErrors.password = "Introduce la contraseña actual";
    if (!passwordData.newPassword) pwErrors.password = "Introduce la nueva contraseña";
    else if (passwordData.newPassword.length < 8) pwErrors.password = "La nueva contraseña debe tener al menos 8 caracteres";
    if (passwordData.newPassword !== passwordData.confirmPassword) pwErrors.password = "Las nuevas contraseñas no coinciden";
    
    if(Object.keys(pwErrors).length > 0) {
      setErrors(prev => ({...prev, ...pwErrors}));
      showErrorToast(pwErrors.password || "Completa correctamente los campos de contraseña.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    setErrors({}); 

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showSuccessToast("Información del perfil actualizada.");
    } catch (err) {
      showErrorToast("Error al actualizar la información del perfil.");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handlePasswordSubmit = async () => {
    if (!validatePasswordForm()) return;
    
    setIsSavingPassword(true); 
    setErrors({});
    try {
      await new Promise(res => setTimeout(res, 1000));
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" }); 
      showSuccessToast("Contraseña cambiada con éxito.");
    } catch(err) {
      showErrorToast("Error al cambiar la contraseña. Verifica la contraseña actual.");
    } finally {
      setIsSavingPassword(false);
    }
  };

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
              errors[name] ? "border-red-300 bg-red-50" : "border-gray-300"
            } ${
              !isEditable || !editableFields[name]
                ? "bg-gray-50 cursor-not-allowed text-gray-500"
                : "bg-white"
            } focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#e53c3d] transition-all`}
          />
          
          {errors[name] && (
            <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
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

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSave = async () => {
    if (!newProfileImageFile) return;
    
    setIsUploadingImage(true);
    setErrors({});
    try {
      await new Promise(res => setTimeout(res, 1000));
      setShowImageModal(false);
      setNewProfileImageFile(null); 
      showSuccessToast("Imagen de perfil actualizada.");
    } catch (err) {
      showErrorToast("Error al subir la imagen.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-50">
        <p>Cargando información...</p>
      </div>
    );
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
                  <FaLock className="text-[#e53c3d]" />
                  <span>Cambiar contraseña</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña actual</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
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
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Introduce tu nueva contraseña"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar nueva contraseña</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
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
                    onClick={handlePasswordSubmit}
                    disabled={isSavingPassword || isSaving || isUploadingImage}
                    className="px-6 py-2.5 bg-[#e53c3d] text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {isSavingPassword ? "Guardando..." : "Cambiar contraseña"}
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
                  disabled={isSaving || isSavingPassword || isUploadingImage}
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

      {showImageModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar modal"
            >
              <FaTimes size={20} />
            </button>
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Cambiar foto de perfil</h3>

            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 mb-4">
                <img
                  src={profileImage}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                className="relative flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <FaCamera />
                <span>Subir nueva imagen</span>
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  accept="image/*" 
                  onChange={handleImageFileChange}
                />
              </button>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleImageSave}
                disabled={!newProfileImageFile || isUploadingImage}
                className="px-5 py-2.5 bg-[#e53c3d] text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isUploadingImage ? "Subiendo..." : "Guardar Imagen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
