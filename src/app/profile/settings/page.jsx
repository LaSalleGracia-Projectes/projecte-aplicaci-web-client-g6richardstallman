"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaGlobe,
  FaBell,
  FaEnvelope,
  FaMobile,
  FaShieldAlt,
  FaToggleOn,
  FaToggleOff,
  FaSave,
  FaHome
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
    push_notifications: false,
    sms_notifications: true,
    marketing_emails: false,
    newsletter: true,
    two_factor: false,
    language: "es",
    timezone: "Europe/Madrid"
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
            {/* Cabecera */}
            <div className="relative h-32 bg-gradient-to-r from-gray-800 to-gray-900">
              <div className="absolute -bottom-12 left-8">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                  <FaGlobe className="text-4xl text-gray-400" />
                </div>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6 pt-16 md:p-8 md:pt-16">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Configuración de Cuenta</h1>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md">
                  Configuración guardada correctamente
                </div>
              )}

              <div className="space-y-8">
                {/* Notificaciones */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaBell className="text-[#e53c3d]" />
                    <span>Notificaciones</span>
                  </h2>
                  
                  <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Notificaciones por email</p>
                        <p className="text-sm text-gray-500">Recibe emails sobre tus compras y eventos</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleToggle('email_notifications')}
                        className={`text-2xl ${settings.email_notifications ? 'text-[#e53c3d]' : 'text-gray-300'}`}
                      >
                        {settings.email_notifications ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Notificaciones push</p>
                        <p className="text-sm text-gray-500">Recibe notificaciones en tu navegador</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleToggle('push_notifications')}
                        className={`text-2xl ${settings.push_notifications ? 'text-[#e53c3d]' : 'text-gray-300'}`}
                      >
                        {settings.push_notifications ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Notificaciones SMS</p>
                        <p className="text-sm text-gray-500">Recibe mensajes de texto sobre tus compras</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleToggle('sms_notifications')}
                        className={`text-2xl ${settings.sms_notifications ? 'text-[#e53c3d]' : 'text-gray-300'}`}
                      >
                        {settings.sms_notifications ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Comunicaciones */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaEnvelope className="text-[#e53c3d]" />
                    <span>Comunicaciones</span>
                  </h2>
                  
                  <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Emails de marketing</p>
                        <p className="text-sm text-gray-500">Recibe ofertas y promociones especiales</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleToggle('marketing_emails')}
                        className={`text-2xl ${settings.marketing_emails ? 'text-[#e53c3d]' : 'text-gray-300'}`}
                      >
                        {settings.marketing_emails ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Newsletter</p>
                        <p className="text-sm text-gray-500">Noticias y actualizaciones semanales</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleToggle('newsletter')}
                        className={`text-2xl ${settings.newsletter ? 'text-[#e53c3d]' : 'text-gray-300'}`}
                      >
                        {settings.newsletter ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Seguridad */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaShieldAlt className="text-[#e53c3d]" />
                    <span>Seguridad</span>
                  </h2>
                  
                  <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Autenticación de dos factores</p>
                        <p className="text-sm text-gray-500">Mayor seguridad para tu cuenta</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleToggle('two_factor')}
                        className={`text-2xl ${settings.two_factor ? 'text-[#e53c3d]' : 'text-gray-300'}`}
                      >
                        {settings.two_factor ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Preferencias */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaGlobe className="text-[#e53c3d]" />
                    <span>Preferencias</span>
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                      <select
                        name="language"
                        value={settings.language}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 focus:outline-none"
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Zona horaria</label>
                      <select
                        name="timezone"
                        value={settings.timezone}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 focus:outline-none"
                      >
                        <option value="Europe/Madrid">Madrid (GMT+1)</option>
                        <option value="Europe/London">Londres (GMT+0)</option>
                        <option value="America/New_York">Nueva York (GMT-5)</option>
                        <option value="America/Los_Angeles">Los Ángeles (GMT-8)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-[#e53c3d] text-white rounded-xl hover:bg-red-600 transition-colors disabled:bg-red-400"
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
    </div>
  );
}
