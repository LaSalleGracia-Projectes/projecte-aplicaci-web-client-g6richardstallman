"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileNavBar from "@/components/profileNavBar";
import { FaSave, FaTimes, FaGlobe, FaBell, FaMoon } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState({
    language: "es",
    notifications: {
      email: true,
      push: true,
      marketing: false,
    },
    darkMode: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Aquí iría la llamada a la API para obtener la configuración
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        setError("Error al cargar la configuración");
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (type, value) => {
    if (type.startsWith("notifications.")) {
      const notificationType = type.split(".")[1];
      setSettings((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationType]: value,
        },
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        [type]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError("");

      // Aquí iría la llamada a la API para guardar la configuración
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push("/profile");
    } catch (error) {
      setError("Error al guardar la configuración");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e53c3d]"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex">
        <ProfileNavBar />

        <div className="flex-1 p-4 md:p-8 pt-24 md:pt-8">
          <div className="max-w-4xl mx-auto">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Cabecera */}
              <div className="relative h-32 bg-gradient-to-r from-gray-800 to-gray-900">
                <div className="absolute -bottom-12 left-8">
                  <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                    <FaGlobe className="text-4xl text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="mt-16 px-4 md:px-8 pb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <h1 className="text-2xl font-bold">Configuración</h1>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button
                      type="button"
                      onClick={() => router.push("/profile")}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      <FaTimes className="text-gray-600" />
                      <span>Cancelar</span>
                    </button>
                    <button
                      type="submit"
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                      disabled={isSaving}
                    >
                      <FaSave />
                      <span>
                        {isSaving ? "Guardando..." : "Guardar cambios"}
                      </span>
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                    {error}
                  </div>
                )}

                {/* Idioma */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <FaGlobe className="text-xl text-gray-600" />
                    <h2 className="text-lg font-semibold">Idioma</h2>
                  </div>
                  <select
                    value={settings.language}
                    onChange={(e) => handleChange("language", e.target.value)}
                    className="w-full md:w-64 p-2 border-2 border-gray-300 rounded focus:border-[#e53c3d] focus:outline-none transition-colors"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="ca">Català</option>
                  </select>
                </div>

                {/* Notificaciones */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <FaBell className="text-xl text-gray-600" />
                    <h2 className="text-lg font-semibold">Notificaciones</h2>
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">
                        Notificaciones por email
                      </span>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.email}
                          onChange={(e) =>
                            handleChange(
                              "notifications.email",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e53c3d]"></div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">
                        Notificaciones push
                      </span>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.push}
                          onChange={(e) =>
                            handleChange("notifications.push", e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e53c3d]"></div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">
                        Notificaciones de marketing
                      </span>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.marketing}
                          onChange={(e) =>
                            handleChange(
                              "notifications.marketing",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e53c3d]"></div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Modo oscuro */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <FaMoon className="text-xl text-gray-600" />
                    <h2 className="text-lg font-semibold">Modo oscuro</h2>
                  </div>
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">
                      Activar modo oscuro
                    </span>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.darkMode}
                        onChange={(e) =>
                          handleChange("darkMode", e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e53c3d]"></div>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
