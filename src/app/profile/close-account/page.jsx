"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaExclamationTriangle, FaLock, FaTrash, FaInfoCircle, FaHome } from "react-icons/fa";
import ProfileNavBar from "@/components/userProfile/profileNavBar";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function CloseAccountPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmText: "",
    reason: ""
  });
  const [errors, setErrors] = useState({});

  const reasons = [
    "Ya no utilizo la plataforma",
    "Encontré una alternativa mejor",
    "Tuve problemas técnicos",
    "No me gusta la interfaz",
    "Preocupaciones sobre privacidad",
    "Otro motivo"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = "Por favor, introduce tu contraseña";
    }
    
    if (formData.confirmText !== "CERRAR CUENTA") {
      newErrors.confirmText = "Por favor, escribe 'CERRAR CUENTA' para confirmar";
    }
    
    if (!formData.reason) {
      newErrors.reason = "Por favor, selecciona un motivo";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setShowConfirmation(true);
  };

  const handleConfirmClose = async () => {
    try {
      setIsLoading(true);
      // Aquí iría la llamada a la API para cerrar la cuenta
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/login");
    } catch (error) {
      setIsLoading(false);
      setErrors({ general: "Error al cerrar la cuenta" });
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

        <div className="max-w-3xl mx-auto pt-16">
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <FaTrash className="text-2xl text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Cerrar tu cuenta</h1>
              <p className="text-gray-600 mt-2 max-w-lg mx-auto">
                Estás a punto de cerrar tu cuenta. Esta acción eliminará permanentemente todos tus datos y no podrá deshacerse.
              </p>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
              <div className="flex gap-3">
                <FaExclamationTriangle className="text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-amber-700 mb-1">Antes de continuar</h3>
                  <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
                    <li>Perderás acceso a todos tus tickets y eventos</li>
                    <li>Tu historial de compras será eliminado</li>
                    <li>Tus datos personales serán borrados</li>
                    <li>No podrás recuperar tu cuenta después</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Por qué quieres cerrar tu cuenta?
                </label>
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className={`w-full p-3 pr-8 border ${
                    errors.reason ? "border-red-500" : "border-gray-300"
                  } rounded-xl focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 focus:outline-none transition-all`}
                >
                  <option value="">Selecciona un motivo</option>
                  {reasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
                {errors.reason && (
                  <p className="mt-1 text-sm text-red-500">{errors.reason}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirma tu contraseña
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Tu contraseña actual"
                    className={`w-full pl-10 p-3 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-xl focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 focus:outline-none transition-all`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Escribe "CERRAR CUENTA" para confirmar
                </label>
                <input
                  type="text"
                  name="confirmText"
                  value={formData.confirmText}
                  onChange={handleChange}
                  placeholder='Escribe "CERRAR CUENTA"'
                  className={`w-full p-3 border ${
                    errors.confirmText ? "border-red-500" : "border-gray-300"
                  } rounded-xl focus:border-[#e53c3d] focus:ring-2 focus:ring-[#e53c3d]/20 focus:outline-none transition-all`}
                />
                {errors.confirmText && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmText}</p>
                )}
              </div>
              
              <div className="pt-4 border-t flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => router.push("/profile")}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm sm:text-base font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm sm:text-base font-medium"
                >
                  Cerrar cuenta permanentemente
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal de confirmación final */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <FaExclamationTriangle className="text-2xl text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">¿Estás completamente seguro?</h2>
              <p className="text-gray-600 mt-2">
                Esta acción cerrará tu cuenta permanentemente y no podrás recuperarla.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm sm:text-base font-medium"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmClose}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm sm:text-base font-medium disabled:bg-red-400"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Cerrando cuenta...
                  </span>
                ) : (
                  "Sí, cerrar cuenta"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
