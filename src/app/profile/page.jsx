"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileNavBar from "@/components/profileNavBar";
import { FaCamera } from "react-icons/fa";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    email: "",
    telefono: "",
    role: "",
    fechaCreacion: "",
    organizacion: "",
    dni: "",
    profileImage: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        // Simulación de llamada a API
        const response = {
          nombre: "Juan",
          apellido1: "García",
          apellido2: "López",
          email: "juan@ejemplo.com",
          telefono: "+34 666 666 666",
          role: "organizador",
          fechaCreacion: "15 de marzo de 2024",
          organizacion: "Eventos García S.L.",
          dni: "12345678A",
          profileImage: null,
        };

        setUserData(response);
        setIsLoading(false);
      } catch (error) {
        setError("Error al cargar los datos del usuario");
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-red-600">{error}</div>
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
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Cabecera con imagen */}
              <div className="relative h-32 bg-gradient-to-r from-gray-800 to-gray-900">
                <div className="absolute -bottom-12 left-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                      {userData.profileImage ? (
                        <img
                          src={userData.profileImage}
                          alt="Foto de perfil"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FaCamera size={24} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del perfil */}
              <div className="mt-16 px-8 pb-8">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">Información Personal</h1>
                  <Link
                    href="/profile/edit-information"
                    className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors text-sm"
                  >
                    Editar información
                  </Link>
                </div>

                {/* Grid de información */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Columna izquierda */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Nombre completo
                      </label>
                      <p className="text-gray-900">
                        {`${userData.nombre} ${userData.apellido1} ${userData.apellido2}`}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Correo electrónico
                      </label>
                      <p className="text-gray-900">{userData.email}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Teléfono
                      </label>
                      <p className="text-gray-900">{userData.telefono}</p>
                    </div>
                  </div>

                  {/* Columna derecha */}
                  <div className="space-y-4">
                    {userData.role === "organizador" ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Organización
                        </label>
                        <p className="text-gray-900">{userData.organizacion}</p>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          DNI
                        </label>
                        <p className="text-gray-900">{userData.dni}</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Tipo de cuenta
                      </label>
                      <p className="text-gray-900 capitalize">
                        {userData.role}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Fecha de creación
                      </label>
                      <p className="text-gray-900">{userData.fechaCreacion}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas específicas según rol */}
            {userData.role === "organizador" ? (
              <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">
                  Estadísticas de eventos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-[#e53c3d]">12</p>
                    <p className="text-sm text-gray-600">Eventos creados</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-[#e53c3d]">1,234</p>
                    <p className="text-sm text-gray-600">Entradas vendidas</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-[#e53c3d]">4.8</p>
                    <p className="text-sm text-gray-600">Valoración media</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Resumen de actividad</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-[#e53c3d]">8</p>
                    <p className="text-sm text-gray-600">Eventos asistidos</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-[#e53c3d]">5</p>
                    <p className="text-sm text-gray-600">Eventos guardados</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-[#e53c3d]">3</p>
                    <p className="text-sm text-gray-600">Próximos eventos</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
