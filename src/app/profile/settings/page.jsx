"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaGlobe,
  FaBell,
  FaShieldAlt,
  FaToggleOn,
  FaToggleOff,
  FaSave,
  FaHome,
  FaCheck,
  FaSun
} from "react-icons/fa";
import ProfileNavBar from "@/components/userProfile/profileNavBar";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [settings, setSettings] = useState({
    email_notifications: true,
    web_notifications: true,
    dark_mode: false,
    two_factor: false,
    language: "es"
  });

  // Simular carga de datos
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  }, []);

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess(false);
    
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      
      // Quitar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError("Error al guardar la configuración");
    } finally {
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
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center shadow-md">
                  <FaGlobe className="text-4xl text-[#e53c3d]" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-800 text-center">Configuración de la cuenta</h1>
              <p className="text-gray-600 mt-1 mb-6 text-center">Personaliza las opciones de tu cuenta</p>

              {/* Mensajes de éxito o error */}
              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
                  <FaCheck className="mr-2 text-green-500" />
                  Configuración guardada correctamente
                </div>
              )}
              
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {/* Sección de notificaciones */}
              <div className="mt-2 bg-white rounded-xl">
                <div className="border-b border-gray-100 pb-4 mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FaBell className="text-[#e53c3d]" />
                    Notificaciones
                  </h2>
                </div>
                
                <div className="space-y-4 px-1">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div>
                      <h3 className="font-medium text-gray-800">Notificaciones por email</h3>
                      <p className="text-sm text-gray-600">Recibe actualizaciones por correo electrónico</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleToggle('email_notifications')}
                      className="text-2xl"
                    >
                      {settings.email_notifications ? 
                        <FaToggleOn className="text-[#e53c3d]" /> : 
                        <FaToggleOff className="text-gray-400" />
                      }
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div>
                      <h3 className="font-medium text-gray-800">Notificaciones web</h3>
                      <p className="text-sm text-gray-600">Recibe alertas en la campanita de la aplicación</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleToggle('web_notifications')}
                      className="text-2xl"
                    >
                      {settings.web_notifications ? 
                        <FaToggleOn className="text-[#e53c3d]" /> : 
                        <FaToggleOff className="text-gray-400" />
                      }
                    </button>
                  </div>
                </div>
              </div>

              {/* Sección de apariencia y modos */}
              <div className="mt-8 bg-white rounded-xl">
                <div className="border-b border-gray-100 pb-4 mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FaSun className="text-[#e53c3d]" />
                    Apariencia
                  </h2>
                </div>
                
                <div className="space-y-4 px-1">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div>
                      <h3 className="font-medium text-gray-800">Modo oscuro</h3>
                      <p className="text-sm text-gray-600">Activar tema oscuro en la aplicación</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleToggle('dark_mode')}
                      className="text-2xl"
                    >
                      {settings.dark_mode ? 
                        <FaToggleOn className="text-[#e53c3d]" /> : 
                        <FaToggleOff className="text-gray-400" />
                      }
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div>
                      <h3 className="font-medium text-gray-800">Idioma</h3>
                      <p className="text-sm text-gray-600">Selecciona tu idioma preferido</p>
                    </div>
                    <select
                      name="language"
                      value={settings.language}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg px-4 py-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#e53c3d]"
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sección de seguridad */}
              <div className="mt-8 bg-white rounded-xl">
                <div className="border-b border-gray-100 pb-4 mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FaShieldAlt className="text-[#e53c3d]" />
                    Seguridad
                  </h2>
                </div>
                
                <div className="space-y-4 px-1">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div>
                      <h3 className="font-medium text-gray-800">Autenticación de dos factores</h3>
                      <p className="text-sm text-gray-600">Protege tu cuenta con una capa adicional de seguridad</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleToggle('two_factor')}
                      className="text-2xl"
                    >
                      {settings.two_factor ? 
                        <FaToggleOn className="text-[#e53c3d]" /> : 
                        <FaToggleOff className="text-gray-400" />
                      }
                    </button>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="px-8 py-6 border-t border-gray-100 flex justify-end mt-8">
                <button
                  type="button"
                  onClick={() => router.push('/profile')}
                  className="px-6 py-2.5 mr-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#e53c3d] text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 disabled:bg-red-400"
                >
                  {isSaving ? (
                    <>
                      <LoadingSpinner size="sm" withText={false} />
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
    </div>
  );
}

