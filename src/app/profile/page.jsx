"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaHome, FaPen, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import Link from "next/link";
import ProfileNavBar from "../../components/userProfile/profileNavBar";

export default function ProfilePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      let isLoggedIn = false;
      try {
        const userInfo = typeof window !== 'undefined' ? 
          JSON.parse(localStorage.getItem('user') || '{}') : {};
        isLoggedIn = userInfo.isLoggedIn && userInfo.token;

        if (process.env.NODE_ENV === "development" && !isLoggedIn) {
           console.warn("Modo desarrollo: Accediendo al perfil sin datos de login reales.");
           isLoggedIn = true;
        }

      } catch (error) {
        console.error("Error al verificar login:", error);
        isLoggedIn = false;
      }

      if (!isLoggedIn) {
         setNeedsLogin(true);
         setLoading(false);
         return;
      }
      
      setNeedsLogin(false);
      try {
        if (process.env.NODE_ENV === "development") {
           await new Promise(resolve => setTimeout(resolve, 800));
           setUserProfile({
              nombre: "Usuario",
              apellido1: "De",
              apellido2: "Prueba",
              email: "usuario@ejemplo.com",
              role: "participante",
              fechaRegistro: "01/01/2023",
              ubicacion: "Madrid, España",
              profileImage: "/img1.webp",
           });
        } else {
        }
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]); // router no es estrictamente necesario aquí si no se usa en el fetch real

  // Lógica de renderizado simplificada
  if (loading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <ProfileNavBar />
        <div className="flex-1 p-4 md:p-8 flex justify-center items-center">
           <p>Cargando perfil...</p> {/* O un spinner SVG simple */}
        </div>
      </div>
    );
  }

  if (needsLogin) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <ProfileNavBar />
        <div className="flex-1 p-4 md:p-8 flex justify-center items-center">
           <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md">
             {/* ... Mensaje de necesita login ... */}
             <Link href="/login" /* ... */>Iniciar sesión</Link>
           </div>
        </div>
      </div>
    );
  }
  
  if (!userProfile) {
     return (
       <div className="min-h-screen flex bg-gray-50">
         <ProfileNavBar />
         <div className="flex-1 p-4 md:p-8 flex justify-center items-center">
           <p className="text-red-600">Error al cargar el perfil.</p>
         </div>
       </div>
     );
  }

  // Renderizado del perfil si todo está OK
  return (
    <div className="min-h-screen flex bg-gray-50">
      <ProfileNavBar />
      <div className="flex-1 p-4 md:p-8 overflow-y-auto relative">
        {/* ... Botón Inicio ... */}
        <div className="max-w-4xl mx-auto pt-16">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* ... Cabecera del perfil ... */}
            {/* ... Información de miembro ... */}
            {/* ... Información personal ... */}

            {/* Sección de actividad */}
            <div className="px-8 py-6 border-t border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Actividad</h2>
               {/* Nota: Estos números son hardcoded. Necesitan datos reales. */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 rounded-lg p-4 text-center hover:shadow-md transition-all hover:bg-red-100">
                  <p className="text-3xl font-bold text-[#e53c3d]">0</p>
                  <p className="text-gray-700 mt-1">Eventos creados</p>
                </div>
                {/* ... otros contadores ... */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

