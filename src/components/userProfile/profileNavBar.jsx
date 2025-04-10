"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaUser,
  FaCog,
  FaHistory,
  FaTrash,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from "react-icons/fa";

const menuItems = [
  {
    title: "Información Personal",
    icon: FaUser,
    href: "/profile",
  },
  {
    title: "Configuración de Cuenta",
    icon: FaCog,
    href: "/profile/settings",
  },
  {
    title: "Historial de Compras",
    icon: FaHistory,
    href: "/profile/purchases",
  },
  {
    title: "Cerrar Cuenta",
    icon: FaTrash,
    href: "/profile/close-account",
    danger: true,
  },
];

export default function ProfileNavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    const currentItem = menuItems.find((item) => item.href === pathname);
    if (currentItem) {
      setActiveItem(currentItem.title);
    }
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="md:w-64 w-0 transition-all duration-300">
      {/* Botón móvil para abrir/cerrar menú */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden fixed bottom-4 left-4 z-50 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
        aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isMenuOpen ? <FaTimes className="text-red-500" /> : <FaBars className="text-[#e53c3d]" />}
      </button>

      {/* Menú lateral - ahora con sticky */}
      <nav className={`fixed md:sticky top-0 left-0 h-full md:h-screen bg-white shadow-lg transition-all duration-300 ${
        isMenuOpen ? "w-64 opacity-100" : "w-0 md:w-64 opacity-0 md:opacity-100 -translate-x-full md:translate-x-0"
      } overflow-hidden z-40`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div 
              className="w-full h-12"
              style={{
                backgroundImage: 'url("/logo.jpg")',
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
          </div>
          
          <ul className="flex-grow overflow-y-auto py-2">
            {menuItems.map((item) => (
              <li key={item.title}>
                <Link 
                  href={item.href}
                  className={`flex items-center px-4 py-3 my-1 mx-2 rounded-lg transition-all ${
                    activeItem === item.title 
                      ? "bg-red-50 text-[#e53c3d]" 
                      : item.danger 
                        ? "text-red-600 hover:bg-red-50" 
                        : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className={`mr-3 ${activeItem === item.title ? "text-[#e53c3d]" : ""}`} />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-all"
            >
              <FaSignOutAlt className="mr-3" />
              <span className="font-medium">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
