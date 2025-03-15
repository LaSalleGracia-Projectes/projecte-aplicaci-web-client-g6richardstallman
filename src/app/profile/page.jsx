"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile, updateUserProfile, logout } from "../../api/auth";
import { FaUser, FaEnvelope, FaIdCard, FaPhone, FaBuilding, FaSpinner } from "react-icons/fa";

export default function ProfilePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    const checkLogin = () => {
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      if (!userInfo.isLoggedIn || !userInfo.token) {
        router.push('/login');
        return false;
      }
      return true;
    };

    const fetchUserProfile = async () => {
      if (!checkLogin()) return;
      
      try {
        const response = await getUserProfile();
        if (response.status === "success") {
          setUserProfile(response.data);
          
          // Inicializar el formulario con los datos del usuario
          const initialFormData = {
            nombre: response.data.nombre,
            apellido1: response.data.apellido1,
            apellido2: response.data.apellido2 || "",
            email: response.data.email,
          };
          
          // Agregar campos específicos según el rol
          if (response.data.role === 'organizador') {
            initialFormData.nombre_organizacion = response.data.organizador?.nombre_organizacion || "";
            initialFormData.telefono_contacto = response.data.organizador?.telefono_contacto || "";
          } else if (response.data.role === 'participante') {
            initialFormData.dni = response.data.participante?.dni || "";
            initialFormData.telefono = response.data.participante?.telefono || "";
          }
          
          setFormData(initialFormData);
        }
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
        // Si hay un error de autenticación, redirigir al login
        if (error.message.includes('autenticación')) {
          localStorage.removeItem('user');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const validateForm = () => {
    const errors = {};
    
    // Validación de campos básicos
    if (!formData.nombre) errors.nombre = "El nombre es obligatorio";
    if (!formData.apellido1) errors.apellido1 = "El primer apellido es obligatorio";
    
    // Validación de email
    if (!formData.email) {
      errors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Por favor, introduce un email válido";
    }
    
    // Validaciones específicas por rol
    if (userProfile?.role === 'organizador') {
      if (!formData.nombre_organizacion) errors.nombre_organizacion = "El nombre de la organización es obligatorio";
      if (!formData.telefono_contacto) errors.telefono_contacto = "El teléfono de contacto es obligatorio";
    } else if (userProfile?.role === 'participante') {
      if (!formData.dni) errors.dni = "El DNI es obligatorio";
      if (!formData.telefono) errors.telefono = "El teléfono es obligatorio";
      
      // Validar formato DNI
      const dniRegex = /^[0-9]{8}[A-Za-z]$/;
      if (formData.dni && !dniRegex.test(formData.dni)) {
        errors.dni = "El formato del DNI debe ser 8 números seguidos de una letra";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setFormErrors({
      ...formErrors,
      [e.target.name]: null
    });
    
    // Limpiar mensajes de éxito/error cuando el usuario empieza a editar
    setUpdateSuccess(false);
    setUpdateError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(false);
    
    try {
      const result = await updateUserProfile(formData);
      if (result.status === "success") {
        setUpdateSuccess(true);
        
        // Actualizar el perfil en la interfaz
        const updatedUserProfile = {
          ...userProfile,
          nombre: formData.nombre,
          apellido1: formData.apellido1,
          apellido2: formData.apellido2,
          email: formData.email
        };
        
        // Actualizar campos específicos según el rol
        if (userProfile.role === 'organizador' && userProfile.organizador) {
          updatedUserProfile.organizador = {
            ...userProfile.organizador,
            nombre_organizacion: formData.nombre_organizacion,
            telefono_contacto: formData.telefono_contacto
          };
        } else if (userProfile.role === 'participante' && userProfile.participante) {
          updatedUserProfile.participante = {
            ...userProfile.participante,
            dni: formData.dni,
            telefono: formData.telefono
          };
        }
        
        setUserProfile(updatedUserProfile);
        setEditMode(false);
      } else {
        setUpdateError(result.message || "Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      setUpdateError("No se pudo actualizar el perfil. Por favor, intenta de nuevo más tarde.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Intentar limpiar localStorage de todos modos y redirigir
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Perfil de Usuario</h1>
          <div className="space-x-3">
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={updateLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {updateLoading ? (
                    <FaSpinner className="animate-spin inline" />
                  ) : (
                    "Guardar"
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Editar Perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cerrar Sesión
                </button>
              </>
            )}
          </div>
        </div>

        {updateSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            Perfil actualizado correctamente
          </div>
        )}

        {updateError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {updateError}
          </div>
        )}

        {editMode ? (
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nombre*
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre || ""}
                  onChange={handleChange}
                  className={`shadow appearance-none border ${formErrors.nombre ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                />
                {formErrors.nombre && (
                  <p className="text-red-500 text-xs italic">{formErrors.nombre}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Primer Apellido*
                </label>
                <input
                  type="text"
                  name="apellido1"
                  value={formData.apellido1 || ""}
                  onChange={handleChange}
                  className={`shadow appearance-none border ${formErrors.apellido1 ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                />
                {formErrors.apellido1 && (
                  <p className="text-red-500 text-xs italic">{formErrors.apellido1}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Segundo Apellido
                </label>
                <input
                  type="text"
                  name="apellido2"
                  value={formData.apellido2 || ""}
                  onChange={handleChange}
                  className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className={`shadow appearance-none border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs italic">{formErrors.email}</p>
                )}
              </div>

              {userProfile?.role === "organizador" && (
                <>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Nombre de la Organización*
                    </label>
                    <input
                      type="text"
                      name="nombre_organizacion"
                      value={formData.nombre_organizacion || ""}
                      onChange={handleChange}
                      className={`shadow appearance-none border ${formErrors.nombre_organizacion ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    />
                    {formErrors.nombre_organizacion && (
                      <p className="text-red-500 text-xs italic">{formErrors.nombre_organizacion}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Teléfono de Contacto*
                    </label>
                    <input
                      type="text"
                      name="telefono_contacto"
                      value={formData.telefono_contacto || ""}
                      onChange={handleChange}
                      className={`shadow appearance-none border ${formErrors.telefono_contacto ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    />
                    {formErrors.telefono_contacto && (
                      <p className="text-red-500 text-xs italic">{formErrors.telefono_contacto}</p>
                    )}
                  </div>
                </>
              )}

              {userProfile?.role === "participante" && (
                <>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      DNI*
                    </label>
                    <input
                      type="text"
                      name="dni"
                      value={formData.dni || ""}
                      onChange={handleChange}
                      className={`shadow appearance-none border ${formErrors.dni ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    />
                    {formErrors.dni && (
                      <p className="text-red-500 text-xs italic">{formErrors.dni}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Teléfono*
                    </label>
                    <input
                      type="text"
                      name="telefono"
                      value={formData.telefono || ""}
                      onChange={handleChange}
                      className={`shadow appearance-none border ${formErrors.telefono ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    />
                    {formErrors.telefono && (
                      <p className="text-red-500 text-xs italic">{formErrors.telefono}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <FaUser className="text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-semibold">{userProfile?.nombre} {userProfile?.apellido1} {userProfile?.apellido2 || ""}</p>
                </div>
              </div>

              <div className="flex items-center">
                <FaEnvelope className="text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{userProfile?.email}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="text-blue-500 mr-3 w-5 text-center">@</div>
                <div>
                  <p className="text-sm text-gray-500">Rol</p>
                  <p className="font-semibold capitalize">{userProfile?.role}</p>
                </div>
              </div>

              {userProfile?.role === "organizador" && userProfile?.organizador && (
                <>
                  <div className="flex items-center">
                    <FaBuilding className="text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Organización</p>
                      <p className="font-semibold">{userProfile.organizador.nombre_organizacion}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaPhone className="text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Teléfono de Contacto</p>
                      <p className="font-semibold">{userProfile.organizador.telefono_contacto}</p>
                    </div>
                  </div>
                </>
              )}

              {userProfile?.role === "participante" && userProfile?.participante && (
                <>
                  <div className="flex items-center">
                    <FaIdCard className="text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">DNI</p>
                      <p className="font-semibold">{userProfile.participante.dni}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaPhone className="text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p className="font-semibold">{userProfile.participante.telefono}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
