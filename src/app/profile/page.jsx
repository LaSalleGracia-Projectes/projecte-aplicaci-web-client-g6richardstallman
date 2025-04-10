"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaSpinner, FaHome, FaPen, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import Link from "next/link";
import ProfileNavBar from "@/components/userProfile/profileNavBar";
import LoadingSpinner from "@/components/common/LoadingSpinner";


// Función simulada para obtener el perfil del usuario
const getUserProfile = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "success",
        data: {
          nombre: "Juan",
          apellido1: "García",
          apellido2: "López",
          email: "juan@ejemplo.com",
          profileImage: "/img1.webp",
          role: "organizador",
          fechaRegistro: "10/05/2023",
          ubicacion: "Madrid, España",
          organizador: {
            nombre_organizacion: "Eventos García S.L.",
            telefono_contacto: "+34 666 777 888"
          }
        }
      });
    }, 800);
  });
};

export default function ProfilePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsLogin, setNeedsLogin] = useState(false);

  // Verificar login y cargar datos
  useEffect(() => {
    const checkLogin = () => {
      try {
        // Si estamos en desarrollo, permitir acceso aun sin login
        if (process.env.NODE_ENV === "development") {
          return true;
        }
        
        const userInfo = typeof window !== 'undefined' ? 
          JSON.parse(localStorage.getItem('user') || '{}') : {};
          
        if (!userInfo.isLoggedIn || !userInfo.token) {
          // No redirigir inmediatamente, establecer un flag
          setNeedsLogin(true);
          return false;
        }
        return true;
      } catch (error) {
        console.error("Error al verificar login:", error);
        setNeedsLogin(true);
        return false;
      }
    };

    const fetchUserProfile = async () => {
      if (!checkLogin()) {
        // Cargar datos de prueba en desarrollo
        if (process.env.NODE_ENV === "development") {
          setUserProfile({
            nombre: "Usuario",
            apellido1: "De",
            apellido2: "Prueba",
            email: "usuario@ejemplo.com",
            role: "participante",
            fechaRegistro: "01/01/2023",
            ubicacion: "Madrid, España",
            profileImage: "/img1.webp"
          });
          setLoading(false);
          return;
        }
        return;
      }
      
      try {
        // Si estamos en desarrollo y no hay API, usar datos simulados
        if (process.env.NODE_ENV === "development") {
          setTimeout(() => {
            setUserProfile({
              nombre: "Usuario",
              apellido1: "De",
              apellido2: "Prueba",
              email: "usuario@ejemplo.com",
              role: "participante",
              fechaRegistro: "01/01/2023",
              ubicacion: "Madrid, España",
              profileImage: "/img1.webp"
            });
            setLoading(false);
          }, 800);
          return;
        }
        
        const response = await getUserProfile();
        if (response.status === "success") {
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
        if (process.env.NODE_ENV !== "development") {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <ProfileNavBar />
        <div className="flex-1 p-4 md:p-8 overflow-y-auto relative">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  // Verificar si userProfile es nulo
  if (!userProfile) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <ProfileNavBar />
        <div className="flex-1 p-4 md:p-8 overflow-y-auto relative flex items-center justify-center">
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // Si necesita login, mostrar un mensaje con botón de redirección
  if (needsLogin) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <ProfileNavBar />
        <div className="flex-1 p-4 md:p-8 overflow-y-auto relative flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md">
            <h2 className="text-xl font-bold mb-4">Sesión no iniciada</h2>
            <p className="text-gray-600 mb-6">
              Necesitas iniciar sesión para acceder a tu perfil
            </p>
            <Link 
              href="/login"
              className="px-6 py-2 bg-[#e53c3d] text-white rounded-lg hover:bg-red-600 transition-colors inline-block"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <ProfileNavBar />
      <div className="flex-1 p-4 md:p-8 overflow-y-auto relative">
        {/* Botón para volver al inicio */}
        <Link
          href="/"
          className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-md"
          aria-label="Volver al inicio"
        >
          <FaHome className="text-lg" />
          <span className="font-medium">Inicio</span>
        </Link>
        
        <div className="max-w-4xl mx-auto pt-16">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Sección de cabecera con foto de perfil */}
            <div className="p-8 pb-0 flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-md">
                  <img 
                    src={userProfile.profileImage || "/img1.webp"} 
                    alt="Foto de perfil" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {userProfile.nombre} {userProfile.apellido1} {userProfile.apellido2}
                  </h1>
                  <p className="text-[#e53c3d] font-semibold mt-1 capitalize">{userProfile.role}</p>
                </div>
              </div>
              
              {/* Botón de editar perfil */}
              <Link
                href="/profile/edit-information"
                className="flex items-center gap-2 px-4 py-2 bg-[#e53c3d] text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm hover:shadow-md"
              >
                <FaPen className="text-sm" />
                <span>Editar perfil</span>
              </Link>
            </div>
            
            {/* Información de miembro */}
            <div className="px-8 pt-4 pb-6">
              <div className="flex flex-col md:flex-row gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-[#e53c3d]" />
                  <span>Miembro desde {userProfile.fechaRegistro}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#e53c3d]" />
                  <span>{userProfile.ubicacion}</span>
                </div>
              </div>
            </div>
            
            {/* Secciones de información */}
            <div className="px-8 py-6 border-t border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Información personal</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center group transition-all duration-200 hover:translate-x-1">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mr-4 group-hover:bg-red-100">
                    <FaUser className="text-[#e53c3d]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nombre completo</p>
                    <p className="font-semibold text-gray-800">
                      {userProfile.nombre} {userProfile.apellido1} {userProfile.apellido2}
                    </p>
                  </div>
                </div>

                <div className="flex items-center group transition-all duration-200 hover:translate-x-1">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mr-4 group-hover:bg-red-100">
                    <FaEnvelope className="text-[#e53c3d]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Correo electrónico</p>
                    <p className="font-semibold text-gray-800">{userProfile.email}</p>
                  </div>
                </div>

                {userProfile.role === "organizador" && (
                  <>
                    <div className="flex items-center group transition-all duration-200 hover:translate-x-1">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mr-4 group-hover:bg-red-100">
                        <FaBuilding className="text-[#e53c3d]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Organización</p>
                        <p className="font-semibold text-gray-800">{userProfile.organizador.nombre_organizacion}</p>
                      </div>
                    </div>

                    <div className="flex items-center group transition-all duration-200 hover:translate-x-1">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mr-4 group-hover:bg-red-100">
                        <FaPhone className="text-[#e53c3d]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Teléfono de contacto</p>
                        <p className="font-semibold text-gray-800">{userProfile.organizador.telefono_contacto}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sección de actividad */}
            <div className="px-8 py-6 border-t border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Actividad</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 rounded-lg p-4 text-center hover:shadow-md transition-all hover:bg-red-100">
                  <p className="text-3xl font-bold text-[#e53c3d]">0</p>
                  <p className="text-gray-700 mt-1">Eventos creados</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center hover:shadow-md transition-all hover:bg-red-100">
                  <p className="text-3xl font-bold text-[#e53c3d]">0</p>
                  <p className="text-gray-700 mt-1">Eventos asistidos</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center hover:shadow-md transition-all hover:bg-red-100">
                  <p className="text-3xl font-bold text-[#e53c3d]">0</p>
                  <p className="text-gray-700 mt-1">Reseñas recibidas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

