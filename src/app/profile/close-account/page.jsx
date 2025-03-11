"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileNavBar from "@/components/profileNavBar";
import { FaExclamationTriangle } from "react-icons/fa";

export default function CloseAccountPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmText: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.confirmText !== "CERRAR CUENTA") {
      alert("Por favor, escribe 'CERRAR CUENTA' para confirmar");
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
      alert("Error al cerrar la cuenta");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex">
        <ProfileNavBar />

        <div className="flex-1 p-4 md:p-8 pt-24 md:pt-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Cabecera */}
              <div className="relative h-32 bg-gradient-to-r from-gray-800 to-gray-900">
                <div className="absolute -bottom-12 left-8">
                  <div className="w-24 h-24 rounded-full border-4 border-white bg-red-100 flex items-center justify-center">
                    <FaExclamationTriangle className="text-4xl text-red-500" />
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="mt-16 px-4 md:px-8 pb-8">
                <h1 className="text-2xl font-bold mb-6">Cerrar cuenta</h1>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
                  <h2 className="text-red-800 font-semibold mb-2">
                    ⚠️ Esta acción es irreversible
                  </h2>
                  <p className="text-red-700 text-sm">
                    Al cerrar tu cuenta, perderás acceso a:
                  </p>
                  <ul className="list-disc list-inside text-red-700 text-sm mt-2 space-y-1">
                    <li>Todos tus eventos y entradas</li>
                    <li>Tu historial de compras</li>
                    <li>Tus datos personales y preferencias</li>
                    <li>No podrás recuperar esta información en el futuro</li>
                  </ul>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña actual
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border-2 border-gray-300 rounded focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Escribe "CERRAR CUENTA" para confirmar
                    </label>
                    <input
                      type="text"
                      name="confirmText"
                      value={formData.confirmText}
                      onChange={handleChange}
                      required
                      placeholder='Escribe "CERRAR CUENTA"'
                      className="w-full p-2 border-2 border-gray-300 rounded focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <button
                      type="button"
                      onClick={() => router.push("/profile")}
                      className="flex-1 px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Cerrar cuenta permanentemente
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de confirmación final */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 md:p-8">
            <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-center mb-4">
              ¿Estás completamente seguro?
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Esta acción cerrará tu cuenta permanentemente y no podrás
              recuperarla.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmClose}
                className="flex-1 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:bg-red-400"
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

      <Footer />
    </div>
  );
}
